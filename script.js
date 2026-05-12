const PHONE_NUMBER = "18094266236";

const SERVICE_LABELS = {
  aeropuerto: "Aeropuerto",
  renta: "Rent car"
};

const RENTAL_RATES = {
  "kia-seltos-2025": {
    label: "Kia Seltos 2025"
  },
  "hyundai-cantus-2023": {
    label: "Hyundai Cantus 2023"
  }
};

const AIRPORT_RATES = {
  "punta-cana": {
    label: "Punta Cana",
    carro: 140,
    vanxl: 160
  },
  "las-terrenas-samana": {
    label: "Las Terrenas, Samaná",
    carro: 175,
    vanxl: 190
  },
  "santo-domingo": {
    label: "Santo Domingo",
    carro: 35,
    vanxl: 45
  },
  santiago: {
    label: "Santiago",
    carro: 140,
    vanxl: 160
  },
  "puerto-plata": {
    label: "Puerto Plata",
    carro: 175,
    vanxl: 190
  },
  "la-romana": {
    label: "La Romana",
    carro: 80,
    vanxl: 100
  }
};

const AIRPORT_VEHICLE_LABELS = {
  carro: "Carro",
  vanxl: "Van XL"
};

const serviceSelect = document.getElementById("servicio");
const serviceButtons = document.querySelectorAll(".service-option");
const formServiceBadge = document.getElementById("formServiceBadge");
const passengerField = document.getElementById("passengerField");

const airportFields = document.getElementById("airportFields");
const rentalFields = document.getElementById("rentalFields");

const airportZone = document.getElementById("aeropuertoZona");
const airportVehicle = document.getElementById("aeropuertoVehiculo");
const airportDirection = document.getElementById("aeropuertoSentido");
const airportPickup = document.getElementById("airportPickup");
const airportDropoff = document.getElementById("airportDropoff");

const rentalVehicle = document.getElementById("rentaVehiculo");
const rentalDays = document.getElementById("rentaDias");
const rentalDelivery = document.getElementById("rentaEntrega");

const estimateTitle = document.getElementById("estimateTitle");
const estimateText = document.getElementById("estimateText");
const bookingForm = document.getElementById("bookingForm");

function money(value) {
  return `US$${value}`;
}

function setGroupVisible(group, visible) {
  group.classList.toggle("hidden", !visible);

  group.querySelectorAll("[data-required='true']").forEach(field => {
    field.required = visible;
  });
}

function getRentalDays() {
  return Math.max(1, parseInt(rentalDays.value || "1", 10));
}

function getRentalPricing(days) {
  if (days < 3) {
    return {
      type: "fixed",
      rate: 60,
      total: days * 60,
      text: `${days} día(s): tarifa US$60/día. Total: ${money(days * 60)}.`
    };
  }

  if (days > 5) {
    return {
      type: "phone",
      text: "Más de 5 días: tarifa entre US$55 y US$60/día. Se confirma por teléfono o WhatsApp."
    };
  }

  return {
    type: "phone",
    text: "Para 3 a 5 días, la tarifa se confirma por teléfono o WhatsApp."
  };
}

function updateServiceUI() {
  const service = serviceSelect.value;

  serviceButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.service === service);
  });

  formServiceBadge.textContent = SERVICE_LABELS[service];
  passengerField.classList.toggle("hidden", service === "renta");
  document.getElementById("pasajeros").required = service !== "renta";

  setGroupVisible(airportFields, service === "aeropuerto");
  setGroupVisible(rentalFields, service === "renta");

  updateEstimate();
}

function updateEstimate() {
  const service = serviceSelect.value;

  if (service === "aeropuerto") {
    const selectedAirport = AIRPORT_RATES[airportZone.value];
    const vehicleType = airportVehicle.value || "carro";
    const vehicleLabel = AIRPORT_VEHICLE_LABELS[vehicleType];

    estimateTitle.textContent = "Traslado al aeropuerto";
    estimateText.textContent = selectedAirport
      ? `${selectedAirport.label} en ${vehicleLabel}: ${money(selectedAirport[vehicleType])}.`
      : "Selecciona aeropuerto y tipo de vehículo para ver la tarifa.";
    return;
  }

  if (service === "renta") {
    const selectedVehicle = RENTAL_RATES[rentalVehicle.value] || RENTAL_RATES["kia-seltos-2025"];
    const days = getRentalDays();
    const pricing = getRentalPricing(days);

    estimateTitle.textContent = "Rent car";
    estimateText.textContent = `${selectedVehicle.label}. ${pricing.text}`;
    return;
  }

  estimateTitle.textContent = "Selecciona un servicio";
  estimateText.textContent = "Elige aeropuerto o rent car para ver la tarifa.";
}

serviceButtons.forEach(button => {
  button.addEventListener("click", () => {
    serviceSelect.value = button.dataset.service;
    updateServiceUI();
    bookingForm.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

[
  serviceSelect,
  airportZone,
  airportVehicle,
  rentalVehicle,
  rentalDays
].forEach(field => {
  field.addEventListener("change", updateServiceUI);
  field.addEventListener("input", updateServiceUI);
});

const today = new Date().toISOString().split("T")[0];
document.getElementById("fecha").setAttribute("min", today);

bookingForm.addEventListener("submit", event => {
  event.preventDefault();

  const service = serviceSelect.value;
  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const pasajeros = document.getElementById("pasajeros").value.trim();
  const fecha = document.getElementById("fecha").value.trim();
  const hora = document.getElementById("hora").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();

  const lines = [
    "Hola, quiero hacer una reserva con Jet White.",
    "",
    `Servicio: ${SERVICE_LABELS[service]}`,
    `Nombre: ${nombre}`,
    `WhatsApp: ${telefono}`,
    `Fecha: ${fecha}`,
    `Hora: ${hora}`
  ];

  if (service !== "renta") {
    lines.splice(5, 0, `Pasajeros: ${pasajeros || "1"}`);
  }

  if (service === "aeropuerto") {
    const selectedAirport = AIRPORT_RATES[airportZone.value];
    const vehicleType = airportVehicle.value || "carro";
    const vehicleLabel = AIRPORT_VEHICLE_LABELS[vehicleType];

    lines.push(`Aeropuerto/zona: ${selectedAirport ? selectedAirport.label : "No especificado"}`);
    lines.push(`Vehículo: ${vehicleLabel}`);
    lines.push(`Tipo de traslado: ${airportDirection.value}`);
    lines.push(`Tarifa: ${selectedAirport ? money(selectedAirport[vehicleType]) : "Pendiente"}`);
    lines.push(`Recogida: ${airportPickup.value.trim() || "No especificada"}`);
    lines.push(`Destino: ${airportDropoff.value.trim() || "No especificado"}`);
  }

  if (service === "renta") {
    const selectedVehicle = RENTAL_RATES[rentalVehicle.value] || RENTAL_RATES["kia-seltos-2025"];
    const days = getRentalDays();
    const pricing = getRentalPricing(days);

    lines.push(`Vehículo: ${selectedVehicle.label}`);
    lines.push(`Días: ${days}`);
    lines.push(`Entrega: ${rentalDelivery.value.trim() || "No especificada"}`);

    if (pricing.type === "fixed") {
      lines.push("Tarifa: US$60/día");
      lines.push(`Total: ${money(pricing.total)}`);
    } else {
      lines.push("Tarifa: Se confirma por teléfono/WhatsApp");
      lines.push(`Nota de tarifa: ${pricing.text}`);
    }
  }

  lines.push(`Nota adicional: ${mensaje || "Ninguna"}`);

  const text = encodeURIComponent(lines.join("\n"));
  window.open(`https://wa.me/${PHONE_NUMBER}?text=${text}`, "_blank");
});

updateServiceUI();
