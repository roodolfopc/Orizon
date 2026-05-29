import json
import math
import re
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd


ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / "outputs" / "programa-orizon" / "Orizon_Kaizen_Operacional_V2.xlsx"
OUT_DIR = ROOT / "outputs" / "site-orizon" / "data"
FULL_OUT = OUT_DIR / "orizon-saas-data.json"
PUBLIC_OUT = OUT_DIR / "orizon-saas-public.json"


def clean_value(value):
    if value is None:
        return None
    if isinstance(value, float) and math.isnan(value):
        return None
    if pd.isna(value):
        return None
    if isinstance(value, (pd.Timestamp, datetime)):
        return value.isoformat()
    if isinstance(value, float) and value.is_integer():
        return int(value)
    return value


def number(value, default=0):
    value = clean_value(value)
    if value in (None, ""):
        return default
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def text(value, default=""):
    value = clean_value(value)
    if value in (None, ""):
        return default
    return str(value).strip()


def slug(value):
    value = unicodedata.normalize("NFKD", text(value).lower())
    value = value.encode("ascii", "ignore").decode("ascii")
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return value or "cliente"


def split_products(value):
    raw = text(value)
    if not raw:
        return []
    return [item.strip() for item in re.split(r",|/|;", raw) if item.strip()]


def read_kaizen_journey():
    df = pd.read_excel(SOURCE, sheet_name="Kaizen_Jornada", header=2)
    df = df.dropna(how="all")
    rows = []
    for _, row in df.iterrows():
        stage = text(row.get("Stage"))
        if not stage.startswith("K"):
            continue
        rows.append({
            "stage": stage,
            "name": text(row.get("Nome")),
            "minScore": number(row.get("Pontuação mínima")),
            "requiredDelivery": text(row.get("Entrega obrigatória")),
            "evidence": text(row.get("Evidência")),
            "suggestedCredits": number(row.get("Créditos sugeridos")),
            "owner": text(row.get("Responsável")),
            "executiveObjective": text(row.get("Objetivo executivo")),
        })
    return rows


def read_data_model():
    df = pd.read_excel(SOURCE, sheet_name="SaaS_Modelo_Dados", header=1)
    df = df.dropna(how="all")
    entities = {}
    for _, row in df.iterrows():
        entity = text(row.get("Entidade"))
        field = text(row.get("Campo"))
        if not entity or not field:
            continue
        entities.setdefault(entity, []).append({
            "field": field,
            "type": text(row.get("Tipo sugerido")),
            "source": text(row.get("Origem")),
            "rule": text(row.get("Regra/Descrição")),
            "required": text(row.get("Obrigatório")).lower().startswith("s"),
        })
    return [{"entity": entity, "fields": fields} for entity, fields in entities.items()]


def category_counts(clients):
    order = ["Foundation", "Flow", "Prime", "Legacy", "Legacy Anchor"]
    return [
        {
            "category": category,
            "clients": sum(1 for client in clients if client["orizonCategory"] == category),
            "areaHa": sum(client["areaHa"] for client in clients if client["orizonCategory"] == category),
            "credits": sum(client["potentialCredits"] for client in clients if client["orizonCategory"] == category),
            "potentialEcosystem": sum(client["potentialEcosystem"] for client in clients if client["orizonCategory"] == category),
        }
        for category in order
    ]


def kaizen_counts(clients):
    return [
        {
            "stage": stage,
            "clients": sum(1 for client in clients if client["kaizenStage"] == stage),
        }
        for stage in ["K0", "K1", "K2", "K3", "K4", "K5"]
    ]


def build():
    clients_df = pd.read_excel(SOURCE, sheet_name="Clientes_Orizon_V2")
    clients_df = clients_df.dropna(subset=["Cliente"])
    clients = []
    for _, row in clients_df.iterrows():
        client_name = text(row.get("Cliente"))
        category = text(row.get("Categoria_Orizon"), "Foundation")
        if category.lower() == "legacy anchor":
            category = "Legacy Anchor"
        client = {
            "id": slug(client_name),
            "name": client_name,
            "areaHa": number(row.get("Area_ha")),
            "canaPlantaHa": number(row.get("Cana_planta_ha")),
            "canaSocaHa": number(row.get("Cana_soca_ha")),
            "originalPriority": text(row.get("Prioridade_original")),
            "currentSituation": text(row.get("Situacao_atual")),
            "proposedAction": text(row.get("Acao_proposta")),
            "scores": {
                "area": number(row.get("Score_Area")),
                "technicalValidation": number(row.get("Score_Validacao")),
                "commercialAccess": number(row.get("Score_Abertura")),
                "portfolio": number(row.get("Score_Portfolio")),
                "strategicInfluence": number(row.get("Score_Influencia")),
            },
            "opi": number(row.get("OPI")),
            "orizonCategory": category,
            "strategicType": text(row.get("Tipo_Estrategico")),
            "kaizenStage": text(row.get("Kaizen_Stage"), "K0"),
            "kaizenScore": number(row.get("Score_Kaizen")),
            "icp": text(row.get("ICP")),
            "conversionProbability": number(row.get("Prob_Conversao")),
            "potentialBiologicsGross": number(row.get("Pot_Biologicos_Bruto_R$")),
            "potentialBiologicsConvertible": number(row.get("Pot_Biologicos_Convertivel_R$")),
            "potentialCredits": number(row.get("Creditos_Potenciais")),
            "potentialTch": number(row.get("Pot_TCH_R$")),
            "potentialConsulting": number(row.get("Pot_Consultoria_R$")),
            "potentialEcosystem": number(row.get("Pot_Total_Ecossistema_R$")),
            "strategicPriority": text(row.get("Prioridade_Estrategica")),
            "mappedProducts": split_products(row.get("Produtos_mapeados")),
            "dataFlag": text(row.get("Flag_Dados")),
            "nextMovement": text(row.get("Proximo_Movimento")),
        }
        clients.append(client)

    clients.sort(key=lambda item: (item["orizonCategory"] != "Legacy Anchor", -item["opi"], -item["potentialEcosystem"]))
    executive = {
        "clientCount": len(clients),
        "areaTotalHa": sum(client["areaHa"] for client in clients),
        "potentialEcosystem": sum(client["potentialEcosystem"] for client in clients),
        "potentialCredits": sum(client["potentialCredits"] for client in clients),
        "opiAverage": sum(client["opi"] for client in clients) / max(1, len(clients)),
        "conversionAverage": sum(client["conversionProbability"] for client in clients) / max(1, len(clients)),
        "vgoValidated": 0,
        "categoryDistribution": category_counts(clients),
        "kaizenDistribution": kaizen_counts(clients),
        "topClients": clients[:8],
    }
    dataset = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "sourceWorkbook": str(SOURCE.relative_to(ROOT)).replace("\\", "/"),
        "executive": executive,
        "clients": clients,
        "kaizenJourney": read_kaizen_journey(),
        "dataModel": read_data_model(),
        "saasModules": [
            {"name": "Clientes e Unidades", "description": "Cadastro, area agricola, situacao e proximo movimento."},
            {"name": "OPI e Categoria", "description": "Classifica potencial estrategico sem alterar maturidade operacional."},
            {"name": "Jornada Kaizen", "description": "Todo cliente inicia em K0 e evolui por evidencia validada."},
            {"name": "Creditos Orizon", "description": "Ledger de acesso a diagnosticos, projetos e servicos."},
            {"name": "Diagnosticos e Projetos", "description": "Conecta gargalos, produtos, plano, implantacao e validacao."},
            {"name": "VGO e Relatorios", "description": "Valor gerado apenas por resultados validados."},
        ],
    }
    public_dataset = {
        "generatedAt": dataset["generatedAt"],
        "executive": {
            key: executive[key]
            for key in ["clientCount", "areaTotalHa", "potentialCredits", "opiAverage", "conversionAverage", "categoryDistribution", "kaizenDistribution"]
        },
        "kaizenJourney": dataset["kaizenJourney"],
        "saasModules": dataset["saasModules"],
    }
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    FULL_OUT.write_text(json.dumps(dataset, ensure_ascii=False, indent=2), encoding="utf-8")
    PUBLIC_OUT.write_text(json.dumps(public_dataset, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"full": str(FULL_OUT), "public": str(PUBLIC_OUT), "clients": len(clients)}, ensure_ascii=False))


if __name__ == "__main__":
    build()
