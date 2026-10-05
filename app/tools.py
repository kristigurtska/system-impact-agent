import json
from pathlib import Path


ARCHITECTURE_FILE = Path(__file__).parent / "architecture.json"


def load_architecture():
    with open(ARCHITECTURE_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def get_architecture():
    """Returns the complete system architecture."""

    architecture = load_architecture()

    return json.dumps(architecture, indent=2)


def find_dependents(service_name: str):
    """Finds services that depend on the given service."""

    architecture = load_architecture()

    dependents = [
        dependency["from"]
        for dependency in architecture["dependencies"]
        if dependency["to"].lower() == service_name.lower()
    ]

    if not dependents:
        return f"No services directly depend on {service_name}."

    return json.dumps({
        "service": service_name,
        "direct_dependents": dependents
    }, indent=2)


def trace_impact(service_name: str):
    """Finds services directly affected by a failure."""

    architecture = load_architecture()

    affected = [
        dependency["from"]
        for dependency in architecture["dependencies"]
        if dependency["to"].lower() == service_name.lower()
    ]

    return json.dumps({
        "failed_service": service_name,
        "affected_services": affected,
        "dependency_rule":
            "The affected services depend on the failed service."
    }, indent=2)


def analyze_incident(service_name: str):
    """Returns information useful for analyzing an incident."""

    architecture = load_architecture()

    for service in architecture["services"]:

        if service["name"].lower() == service_name.lower():

            return json.dumps({
                "service": service["name"],
                "area": service["area"],
                "responsible_group": service["group"],
                "components": service["components"]
            }, indent=2)

    return f"Service '{service_name}' was not found."