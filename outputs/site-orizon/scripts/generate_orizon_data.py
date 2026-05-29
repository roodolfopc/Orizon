from __future__ import annotations

import json
import math
import posixpath
import re
import unicodedata
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from xml.etree import ElementTree as ET


ROOT = Path(__file__).resolve().parents[3]
WORKBOOK_PATH = ROOT / "outputs" / "programa-orizon" / "Programa_Orizon_Compilado.xlsx"
OUTPUT_PATH = ROOT / "outputs" / "site-orizon" / "data" / "orizon-data.json"
DATA_DIR = ROOT / "outputs" / "site-orizon" / "data"

NS = {
    "main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "rel": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "pkgrel": "http://schemas.openxmlformats.org/package/2006/relationships",
}


def column_to_number(col: str) -> int:
    value = 0
    for char in col:
        value = value * 26 + ord(char.upper()) - 64
    return value


def split_cell_ref(ref: str) -> tuple[int, int]:
    match = re.match(r"([A-Z]+)(\d+)", ref.upper())
    if not match:
        raise ValueError(f"Invalid cell reference: {ref}")
    return column_to_number(match.group(1)), int(match.group(2))


def parse_range(address: str) -> tuple[int, int, int, int]:
    start, end = address.split(":")
    start_col, start_row = split_cell_ref(start)
    end_col, end_row = split_cell_ref(end)
    return start_col, start_row, end_col, end_row


def normalize_key(value: Any) -> str:
    text = "" if value is None else str(value)
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^a-zA-Z0-9]+", " ", text).strip().lower()
    return text


def slugify(value: Any) -> str:
    key = normalize_key(value)
    return re.sub(r"\s+", "-", key)


def clean_text(value: Any) -> Any:
    if isinstance(value, str):
        return re.sub(r"\s+", " ", value.replace("\n", " ")).strip()
    return value


def to_number(value: Any) -> float:
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return float(value)
    return 0.0


def compact_number(value: float) -> int | float:
    if math.isclose(value, round(value)):
        return int(round(value))
    return round(value, 4)


class XlsxReader:
    def __init__(self, path: Path):
        self.path = path
        self.archive = zipfile.ZipFile(path)
        self.shared_strings = self._load_shared_strings()
        self.sheets = self._load_sheets()

    def _load_shared_strings(self) -> list[str]:
        try:
            xml = self.archive.read("xl/sharedStrings.xml")
        except KeyError:
            return []
        root = ET.fromstring(xml)
        strings: list[str] = []
        for item in root.findall("main:si", NS):
            parts = [node.text or "" for node in item.findall(".//main:t", NS)]
            strings.append("".join(parts))
        return strings

    def _load_sheets(self) -> dict[str, str]:
        workbook = ET.fromstring(self.archive.read("xl/workbook.xml"))
        rels = ET.fromstring(self.archive.read("xl/_rels/workbook.xml.rels"))
        rel_map = {
            rel.attrib["Id"]: rel.attrib["Target"]
            for rel in rels.findall("pkgrel:Relationship", NS)
        }

        sheets: dict[str, str] = {}
        for sheet in workbook.findall("main:sheets/main:sheet", NS):
            name = sheet.attrib["name"]
            rel_id = sheet.attrib[f"{{{NS['rel']}}}id"]
            target = rel_map[rel_id]
            path = target.lstrip("/") if target.startswith("/") else posixpath.normpath(f"xl/{target}")
            sheets[name] = path
        return sheets

    def _cell_value(self, cell: ET.Element) -> Any:
        cell_type = cell.attrib.get("t")
        value_node = cell.find("main:v", NS)

        if cell_type == "inlineStr":
            return clean_text("".join(node.text or "" for node in cell.findall(".//main:t", NS)))

        if value_node is None or value_node.text is None:
            return None

        raw = value_node.text
        if cell_type == "s":
            index = int(raw)
            return clean_text(self.shared_strings[index] if index < len(self.shared_strings) else "")
        if cell_type == "b":
            return raw == "1"
        if cell_type in {"str", "e"}:
            return clean_text(raw)

        try:
            number = float(raw)
            return int(number) if number.is_integer() else number
        except ValueError:
            return clean_text(raw)

    def range_values(self, sheet_name: str, address: str) -> list[list[Any]]:
        min_col, min_row, max_col, max_row = parse_range(address)
        width = max_col - min_col + 1
        height = max_row - min_row + 1
        matrix: list[list[Any]] = [[None for _ in range(width)] for _ in range(height)]
        root = ET.fromstring(self.archive.read(self.sheets[sheet_name]))

        for cell in root.findall(".//main:sheetData/main:row/main:c", NS):
            ref = cell.attrib.get("r")
            if not ref:
                continue
            col, row = split_cell_ref(ref)
            if min_col <= col <= max_col and min_row <= row <= max_row:
                matrix[row - min_row][col - min_col] = self._cell_value(cell)
        return matrix


def rows_to_dicts(values: list[list[Any]]) -> list[dict[str, Any]]:
    headers = [str(clean_text(header or "")).strip() for header in values[0]]
    rows: list[dict[str, Any]] = []
    for row in values[1:]:
        if not any(cell is not None and cell != "" for cell in row):
            continue
        record = {headers[index]: clean_text(cell) for index, cell in enumerate(row) if headers[index]}
        rows.append(record)
    return rows


def lookup(record: dict[str, Any], *keys: str) -> Any:
    normalized = {normalize_key(key): value for key, value in record.items()}
    for key in keys:
        value = normalized.get(normalize_key(key))
        if value is not None:
            return value
    return None


def level_display(level: Any) -> str:
    text = str(level or "START").upper()
    return "START" if text == "FOUNDATION" else text


def assisted_stage(name: str, level: str, model: str) -> dict[str, Any]:
    text = normalize_key(f"{name} {level} {model}")
    if "raizen" in text or "prospeccao" in text or level == "START":
        stage = "Diagnosticar"
        progress = 34
    elif "protocolo" in text or "conversao" in text or "entrada" in text or level == "FLOW":
        stage = "Corrigir"
        progress = 64
    else:
        stage = "Evoluir"
        progress = 88

    steps = []
    for item in ["Diagnosticar", "Corrigir", "Evoluir"]:
        if item == stage:
            status = "current"
        elif ["Diagnosticar", "Corrigir", "Evoluir"].index(item) < ["Diagnosticar", "Corrigir", "Evoluir"].index(stage):
            status = "done"
        else:
            status = "next"
        steps.append({"name": item, "status": status})
    return {"current": stage, "progress": progress, "steps": steps}


def approval_route(level: str) -> dict[str, str]:
    if level == "LEGACY":
        return {
            "status": "Comite executivo",
            "authority": "Diretoria + comercial + tecnico",
            "rule": "Plano executivo, governanca mensal e assinatura por fase.",
        }
    if level == "PRIME":
        return {
            "status": "Aprovacao gerencial",
            "authority": "Gerencia comercial + tecnico",
            "rule": "Plano tecnico, mix core e indicador de resultado.",
        }
    if level == "FLOW":
        return {
            "status": "Plano tecnico simples",
            "authority": "Comercial + tecnico",
            "rule": "Prova de valor com criterio de continuidade.",
        }
    return {
        "status": "Qualificacao controlada",
        "authority": "Comercial responsavel",
        "rule": "Sem investimento relevante antes de dor, acesso e decisor.",
    }


def client_credit(level: str, recommended: float) -> dict[str, float]:
    if recommended <= 0:
        return {"recommended": 0, "approvable": 0, "approved": 0, "pending": 0, "blocked": 0}
    factors = {"LEGACY": 0.72, "PRIME": 0.58, "FLOW": 0.42, "START": 0.18}
    approvable = recommended * factors.get(level, 0.18)
    approved = approvable * (0.34 if level in {"LEGACY", "PRIME"} else 0.12)
    pending = approvable - approved
    blocked = max(recommended - approvable, 0)
    return {
        "recommended": round(recommended, 2),
        "approvable": round(approvable, 2),
        "approved": round(approved, 2),
        "pending": round(pending, 2),
        "blocked": round(blocked, 2),
    }


def follow_up_for(level: str, stage: str, next_decision: str) -> dict[str, Any]:
    cadence = {
        "LEGACY": "Mensal executivo + semanal operacional",
        "PRIME": "Mensal com gestor + semanal comercial",
        "FLOW": "Quinzenal ate prova de valor",
        "START": "Semanal ate qualificacao",
    }.get(level, "Semanal")
    if stage == "Diagnosticar":
        trigger = "Diagnostico pendente ou decisor ainda nao confirmado"
    elif stage == "Corrigir":
        trigger = "Plano tecnico, treinamento ou correcao em andamento"
    else:
        trigger = "Evidencia tecnica e tese de expansao para proxima safra"
    return {"cadence": cadence, "trigger": trigger, "nextAction": next_decision}


def build_dataset() -> dict[str, Any]:
    reader = XlsxReader(WORKBOOK_PATH)

    carteira = rows_to_dicts(reader.range_values("Carteira 2026", "A4:AA49"))
    especificacao = rows_to_dicts(reader.range_values("Especificacao Clientes", "A4:U49"))
    products_raw = rows_to_dicts(reader.range_values("Produtos e Pesos", "A4:I20"))
    policy_raw = rows_to_dicts(reader.range_values("Politica ORIZON", "A13:I17"))
    pipeline_raw = rows_to_dicts(reader.range_values("Pipeline Mensal", "A4:C16"))
    partners_raw = rows_to_dicts(reader.range_values("Parceiros Operacionais", "A4:E10"))
    actions_raw = rows_to_dicts(reader.range_values("Acoes por Modelo", "A4:E10"))
    score_raw = reader.range_values("Modelo Pontuacao", "A4:H34")
    raizen_raw = reader.range_values("Raizen Piloto LEGACY", "A4:F22")

    carteira_by_name = {normalize_key(lookup(row, "Cliente")): row for row in carteira}
    spec_by_name = {normalize_key(lookup(row, "Cliente")): row for row in especificacao}
    all_names = sorted(
        set(carteira_by_name.keys()) | set(spec_by_name.keys()),
        key=lambda key: -to_number(lookup(spec_by_name.get(key, {}), "Score ORIZON reformulado", "Score total")),
    )

    product_keys = ["Auras", "Auba", "Nerut", "Tritter", "Artefato", "Bovettus", "Mettus", "Bettus", "Aufix"]
    clients: list[dict[str, Any]] = []
    for rank, key in enumerate(all_names, start=1):
        c_row = carteira_by_name.get(key, {})
        s_row = spec_by_name.get(key, {})
        name = lookup(s_row, "Cliente") or lookup(c_row, "Cliente")
        original_level = lookup(s_row, "Nivel ORIZON reformulado") or lookup(c_row, "Nivel ORIZON reformulado")
        level = level_display(original_level)
        model = str(lookup(s_row, "Modelo de negocio") or lookup(c_row, "Modelo negocio") or "")
        score = to_number(lookup(s_row, "Score ORIZON reformulado", "Score total") or lookup(c_row, "Score ORIZON reformulado"))
        credit = to_number(lookup(s_row, "Credito recomendado") or lookup(c_row, "Credito ORIZON recomendado"))
        stage = assisted_stage(str(name), level, model)

        client = {
            "id": slugify(name),
            "rank": rank,
            "name": name,
            "level": level,
            "sourceLevel": original_level,
            "score": compact_number(score),
            "priority": lookup(c_row, "Prioridade"),
            "owner": lookup(c_row, "Responsavel") or "A definir",
            "areaHa": compact_number(to_number(lookup(c_row, "Area ha"))),
            "canaPlanta": compact_number(to_number(lookup(c_row, "Cana planta"))),
            "canaSoca": compact_number(to_number(lookup(c_row, "Cana soca"))),
            "situation": lookup(c_row, "Situacao atual"),
            "proposedAction": lookup(c_row, "Acao proposta"),
            "governanceStatus": lookup(c_row, "Status governanca"),
            "businessModel": model,
            "maturityFactor": lookup(c_row, "Fator maturidade reformulado"),
            "potential": lookup(s_row, "Potencial ORIZON reformulado"),
            "adoptionStage": lookup(s_row, "Estagio de adocao"),
            "technologyEntry": lookup(s_row, "Tecnologia de entrada"),
            "adoptionDirective": lookup(s_row, "Diretriz de adocao"),
            "partner": lookup(s_row, "Parceiro indicado"),
            "evolutionTrack": lookup(s_row, "Trilha de evolucao"),
            "executiveSpecification": lookup(s_row, "Especificacao executiva"),
            "governance": lookup(s_row, "Governanca"),
            "scoreBreakdown": {
                "porte": compact_number(to_number(lookup(s_row, "Score porte"))),
                "prioridade": compact_number(to_number(lookup(s_row, "Score prioridade"))),
                "adocaoTecnica": compact_number(to_number(lookup(s_row, "Score adocao tecnica"))),
                "conversao": compact_number(to_number(lookup(s_row, "Score conversao"))),
                "fitOrizon": compact_number(to_number(lookup(s_row, "Score fit ORIZON"))),
            },
            "queue": lookup(s_row, "Fila inicial"),
            "nextDecision": lookup(s_row, "Proxima decisao") or lookup(c_row, "Acao proposta"),
            "creditRecommended": round(credit, 2),
            "creditControl": client_credit(level, credit),
            "assistStage": stage,
            "approval": approval_route(level),
            "followUp": follow_up_for(level, stage["current"], str(lookup(s_row, "Proxima decisao") or "")),
            "productVolumes": {
                product: lookup(c_row, product)
                for product in product_keys
                if lookup(c_row, product) not in (None, "")
            },
        }
        clients.append(client)

    products = []
    for row in products_raw:
        product = lookup(row, "Produto")
        if not product:
            continue
        factor = to_number(lookup(row, "Fator credito"))
        if factor <= 0:
            continue
        products.append(
            {
                "product": product,
                "role": lookup(row, "Papel"),
                "creditFactor": factor,
                "currentValue": to_number(lookup(row, "Valor vigente (L ou Kg)")),
                "doseHa": to_number(lookup(row, "Dose/ha (L ou Kg)")),
                "estimatedRevenueHa": to_number(lookup(row, "Receita/ha estimada")),
                "creditPerUnit": to_number(lookup(row, "Credito por L ou Kg")),
                "creditPerHa": to_number(lookup(row, "Credito por ha")),
                "usageRule": lookup(row, "Regra de uso"),
                "eligible": factor > 0,
            }
        )

    policy = []
    for row in policy_raw:
        level = level_display(lookup(row, "Nivel"))
        policy.append(
            {
                "level": level,
                "sourceLevel": lookup(row, "Nivel"),
                "scoreRange": lookup(row, "Score reformulado"),
                "capPercent": to_number(lookup(row, "% teto sobre cotacao vigente")),
                "purchaseRequirement": lookup(row, "Exigencia de compra"),
                "monthlyCap": to_number(lookup(row, "Teto calculado do mes")),
                "liberableCredit": to_number(lookup(row, "Credito liberavel")),
                "usageTrigger": lookup(row, "Gatilho de uso"),
                "governance": lookup(row, "Governanca"),
                "protectionRule": lookup(row, "Regra de protecao"),
            }
        )

    pipeline = [
        {
            "month": lookup(row, "Mes"),
            "potential": to_number(lookup(row, "Potencial R$")),
            "share": to_number(lookup(row, "Participacao")),
        }
        for row in pipeline_raw
    ]

    partners = [
        {
            "name": lookup(row, "Parceiro"),
            "role": lookup(row, "Papel"),
            "when": lookup(row, "Quando acionar"),
            "deliverable": lookup(row, "Entrega esperada"),
            "recommendedLevel": lookup(row, "Nivel recomendado"),
        }
        for row in partners_raw
    ]

    business_actions = [
        {
            "model": lookup(row, "Modelo de negocio"),
            "objective": lookup(row, "Objetivo"),
            "healthyPolicy": lookup(row, "Politica saudavel"),
            "nextAction": lookup(row, "Proxima acao"),
            "indicator": lookup(row, "Indicador"),
        }
        for row in actions_raw
    ]

    score_components = []
    for row in rows_to_dicts(score_raw[:7]):
        score_components.append(
            {
                "component": lookup(row, "Componente"),
                "maxWeight": to_number(lookup(row, "Peso max.")),
                "source": lookup(row, "Fonte principal"),
                "rule": lookup(row, "Regra executiva"),
            }
        )

    score_levels = []
    for row in rows_to_dicts(score_raw[8:13]):
        score_levels.append(
            {
                "range": lookup(row, "Faixa de score"),
                "level": level_display(lookup(row, "Nivel")),
                "queue": lookup(row, "Fila inicial"),
                "conduct": lookup(row, "Conduta"),
            }
        )

    top_clients = []
    for row in rows_to_dicts(score_raw[21:31]):
        top_clients.append(
            {
                "name": lookup(row, "Top clientes por score"),
                "score": to_number(lookup(row, "Score")),
                "level": level_display(lookup(row, "Nivel")),
                "queue": lookup(row, "Fila"),
                "areaHa": to_number(lookup(row, "Area ha")),
                "priority": lookup(row, "Prioridade"),
                "model": lookup(row, "Modelo"),
                "nextDecision": lookup(row, "Proxima decisao"),
            }
        )

    raizen_decisions = rows_to_dicts(raizen_raw[:9])
    raizen_budget = rows_to_dicts(raizen_raw[11:])
    raizen_client = next((client for client in clients if "raizen" in normalize_key(client["name"])), None)

    level_counts: dict[str, int] = {}
    level_credit: dict[str, float] = {}
    for client in clients:
        level_counts[client["level"]] = level_counts.get(client["level"], 0) + 1
        level_credit[client["level"]] = level_credit.get(client["level"], 0) + to_number(client["creditRecommended"])

    total_area = sum(to_number(client["areaHa"]) for client in clients)
    total_credit = sum(to_number(client["creditRecommended"]) for client in clients)
    total_pipeline = sum(item["potential"] for item in pipeline)
    average_score = sum(to_number(client["score"]) for client in clients) / len(clients)
    prime_plus = sum(1 for client in clients if client["level"] in {"PRIME", "LEGACY"})

    return {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "sourceWorkbook": str(WORKBOOK_PATH.relative_to(ROOT)).replace("\\", "/"),
        "executive": {
            "clientCount": len(clients),
            "areaTotalHa": compact_number(total_area),
            "pipelinePotential": round(total_pipeline, 2),
            "scoreAverage": round(average_score, 2),
            "creditRecommended": round(total_credit, 2),
            "primePlusClients": prime_plus,
            "immediateQueue": sum(1 for client in clients if str(client.get("queue", "")).startswith("Fila 1")),
            "anchorClient": "Grupo Raizen",
            "levels": {
                level: {"clients": level_counts.get(level, 0), "credit": round(level_credit.get(level, 0), 2)}
                for level in ["START", "FLOW", "PRIME", "LEGACY"]
            },
        },
        "clients": clients,
        "products": products,
        "policy": policy,
        "pipeline": pipeline,
        "partners": partners,
        "businessActions": business_actions,
        "scoreModel": {
            "components": score_components,
            "levels": score_levels,
            "topClients": top_clients,
        },
        "raizenPilot": {
            "clientId": raizen_client["id"] if raizen_client else None,
            "decisions": raizen_decisions,
            "budget": raizen_budget,
        },
    }


def sanitize_client(client: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": client["id"],
        "name": client["name"],
        "level": client["level"],
        "areaHa": client["areaHa"],
        "potential": client.get("potential"),
        "adoptionStage": client.get("adoptionStage"),
        "technologyEntry": client.get("technologyEntry"),
        "adoptionDirective": client.get("adoptionDirective"),
        "partner": client.get("partner"),
        "evolutionTrack": client.get("evolutionTrack"),
        "governance": client.get("governance"),
        "assistStage": client.get("assistStage"),
        "approvalStatus": client.get("approval", {}).get("status"),
        "followUp": client.get("followUp"),
        "clientReport": {
            "title": f"Evolution Report | {client['name']}",
            "thesis": client.get("executiveSpecification"),
            "nextCycle": client.get("nextDecision"),
            "proof": "Apoio tecnico-operacional condicionado a diagnostico, plano aprovado e evidencia de campo.",
        },
    }


def build_public_summary(dataset: dict[str, Any]) -> dict[str, Any]:
    return {
        "generatedAt": dataset["generatedAt"],
        "program": {
            "name": "ORIZON",
            "subtitle": "Plataforma de Evolucao Operacional Agricola",
            "positioning": "Programa 100% assistido para diagnosticar gargalos, corrigir operacoes e evoluir a maturidade operacional do cliente.",
            "principles": [
                "Credito ORIZON e budget tecnico-operacional, nao desconto.",
                "Clientes evoluem por maturidade e evidencia, nao por pressao comercial.",
                "Parceiros entram por necessidade tecnica, com TCH como diagnostico inicial recomendado e Mais Maquinas como evolucao estrutural futura.",
            ],
            "stages": [
                {
                    "name": "Diagnosticar",
                    "description": "Identificar gargalos operacionais, qualidade de aplicacao, janelas e padronizacao.",
                },
                {
                    "name": "Corrigir",
                    "description": "Estruturar treinamentos, recomendacoes tecnicas, planos e correcao de processos.",
                },
                {
                    "name": "Evoluir",
                    "description": "Modernizar sistemas, implementar melhorias e consolidar evolucao continua.",
                },
            ],
        },
        "aggregates": {
            "clientsMapped": dataset["executive"]["clientCount"],
            "primePlusClients": dataset["executive"]["primePlusClients"],
            "levels": {
                level: {"clients": values["clients"]}
                for level, values in dataset["executive"]["levels"].items()
            },
        },
        "publicAgents": [
            "Maestro ORIZON",
            "Tecnico / Diagnostico Agent",
            "Credito / Politica Agent",
            "Aprovacao / Assinatura Agent",
            "GIS / Areas Agent",
            "Follow-up / Cadencia Agent",
            "Relatorio Executivo Agent",
        ],
    }


def build_partner_payload(dataset: dict[str, Any], partner: str) -> dict[str, Any]:
    partner_key = normalize_key(partner)
    assigned = []
    for client in dataset["clients"]:
        text = normalize_key(f"{client.get('partner')} {client.get('businessModel')} {client.get('evolutionTrack')}")
        if ("tch" in partner_key and "tch" in text) or ("mais" in partner_key and "maquinas" in text):
            assigned.append(
                {
                    "id": client["id"],
                    "name": client["name"],
                    "level": client["level"],
                    "assistStage": client["assistStage"],
                    "scope": client.get("evolutionTrack") or client.get("adoptionDirective"),
                    "nextMilestone": client.get("followUp", {}).get("trigger"),
                }
            )
    return {
        "generatedAt": dataset["generatedAt"],
        "partner": partner,
        "assignedClients": assigned[:20],
        "visibility": "partner",
        "note": "Payload sem credito, politica comercial, ranking, score breakdown ou dados de outros parceiros.",
    }


def main() -> None:
    dataset = build_dataset()
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(dataset, ensure_ascii=False, indent=2), encoding="utf-8")
    (DATA_DIR / "public-summary.json").write_text(
        json.dumps(build_public_summary(dataset), ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    client_dir = DATA_DIR / "clients"
    partner_dir = DATA_DIR / "partners"
    client_dir.mkdir(parents=True, exist_ok=True)
    partner_dir.mkdir(parents=True, exist_ok=True)
    for client in dataset["clients"]:
        (client_dir / f"{client['id']}.json").write_text(
            json.dumps(sanitize_client(client), ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
    (partner_dir / "tch.json").write_text(
        json.dumps(build_partner_payload(dataset, "TCH"), ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    (partner_dir / "mais-maquinas.json").write_text(
        json.dumps(build_partner_payload(dataset, "Mais Maquinas"), ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Generated {OUTPUT_PATH} with {len(dataset['clients'])} clients")


if __name__ == "__main__":
    main()
