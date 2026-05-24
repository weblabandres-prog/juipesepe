const PHONE_NUMBER = "18094266236";

/* =========================================
   LABELS
========================================= */

const SERVICE_LABELS = {
  aeropuerto: "Taxi Aeropuerto",
  renta: "Rent a Car"
};

const AIRPORT_VEHICLE_LABELS = {
  carro: "Carro (1-4 personas)",
  vanxl: "Van XL (5-7 personas)",
  xxl: "Van XXL (+8 personas)"
};

/* =========================================
   RENTAL VEHICLES
========================================= */

const RENTAL_RATES = {
  "kia-sonet-2025": { label: "Kia Sonet 2025" },
  "kia-seltos-2025": { label: "Kia Seltos 2025" },
  "hyundai-tucson-2021": { label: "Hyundai Tucson 2021" },
  "honda-crv-2025": { label: "Honda CR-V 2025" },
  "maserati-2021": { label: "Maserati Ghibli 2021" }
};

/* =========================================
   AIRPORT RATES
========================================= */

const AIRPORT_RATES = {
  "punta-cana": { label: "Punta Cana", carro: 140, vanxl: 160 },
  "las-terrenas-samana": { label: "Las Terrenas, Samaná", carro: 175, vanxl: 190 },
  "santo-domingo": { label: "Santo Domingo", carro: 35, vanxl: 45 },
  "santiago": { label: "Santiago", carro: 140, vanxl: 160 },
  "puerto-plata": { label: "Puerto Plata", carro: 175, vanxl: 190 },
  "la-romana": { label: "La Romana", carro: 80, vanxl: 100 }
};

/* =========================================
   ELEMENTS
========================================= */

const serviceSelect = document.getElementById("servicio");
const serviceButtons = document.querySelectorAll(".service-option");
const formServiceBadge = document.getElementById("formServiceBadge");

const airportFields = document.getElementById("airportFields");
const rentalFields = document.getElementById("rentalFields");

const airportZone = document.getElementById("aeropuertoZona");
const airportVehicle = document.getElementById("aeropuertoVehiculo");
const airportPickup = document.getElementById("airportPickup");
const flightNumber = document.getElementById("flightNumber");
const otroDestinoField = document.getElementById("otroDestinoField");
const otroDestino = document.getElementById("otroDestino");

const rentalVehicle = document.getElementById("rentaVehiculo");
const rentalDays = document.getElementById("rentaDias");
const rentalDelivery = document.getElementById("rentaEntrega");

const estimateTitle = document.getElementById("estimateTitle");
const estimateText = document.getElementById("estimateText");
const bookingForm = document.getElementById("bookingForm");
const timeSelect = document.getElementById("hora");

/* =========================================
   HELPERS
========================================= */

function money(value) {
  return `US$${value}`;
}

function smoothToForm() {
  bookingForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getRentalDays() {
  return Math.max(1, parseInt(rentalDays.value || "1", 10));
}

function setGroupVisible(group, visible) {
  if (!group) return;
  group.classList.toggle("hidden", !visible);
}

/* =========================================
   TIME OPTIONS
========================================= */

function populateTimeOptions() {
  if (!timeSelect) return;
  timeSelect.innerHTML = '<option value="">Selecciona una hora</option>';

  for (let hour = 0; hour < 24; hour++) {
    [0, 30].forEach(minutes => {
      const option = document.createElement("option");
      const formatted = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      option.value = formatted;
      option.textContent = formatted;
      timeSelect.appendChild(option);
    });
  }
}

/* =========================================
   ESTIMATE
========================================= */

function updateEstimate() {
  const service = serviceSelect.value;

  if (!estimateTitle || !estimateText) return;

  if (service === "aeropuerto") {
    const zone = AIRPORT_RATES[airportZone.value];
    const vehicleType = airportVehicle.value || "carro";
    const vehicleLabel = AIRPORT_VEHICLE_LABELS[vehicleType];

    let rateText = "Cotizar por WhatsApp";
    if (zone && zone[vehicleType] !== undefined) {
      rateText = money(zone[vehicleType]);
    }

    estimateTitle.textContent = "Traslado Aeropuerto";
    estimateText.textContent = zone
      ? `${zone.label} • ${vehicleLabel}: ${rateText}`
      : "Selecciona destino y vehículo";
  } 
  else if (service === "renta") {
    const vehicle = RENTAL_RATES[rentalVehicle.value];
    const days = getRentalDays();

    let text = "";
    if (days <= 2) {
      text = `US$60/día — Total: ${money(days * 60)}`;
    } else if (days > 5) {
      text = "Tarifa especial para más de 5 días (confirmar por WhatsApp)";
    } else {
      text = `US$50–55/día • Total aproximado: US$${days * 55}`;
    }

    estimateTitle.textContent = "Rent a Car";
    estimateText.textContent = `${vehicle ? vehicle.label : "Vehículo"} • ${text}`;
  }
}

/* =========================================
   SERVICE SWITCH
========================================= */

function updateServiceUI() {
  const service = serviceSelect.value;

  // Toggle active buttons
  serviceButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.service === service);
  });

  if (formServiceBadge) {
    formServiceBadge.textContent = SERVICE_LABELS[service];
  }

  setGroupVisible(airportFields, service === "aeropuerto");
  setGroupVisible(rentalFields, service === "renta");

  updateEstimate();
}

/* =========================================
   EVENTS
========================================= */

// Service buttons
serviceButtons.forEach(button => {
  button.addEventListener("click", () => {
    serviceSelect.value = button.dataset.service;
    updateServiceUI();
    smoothToForm();
  });
});

// Catalog buttons
document.querySelectorAll(".catalog-reserve").forEach(btn => {
  btn.addEventListener("click", () => {
    serviceSelect.value = "renta";
    if (rentalVehicle) rentalVehicle.value = btn.dataset.rental;
    updateServiceUI();
    smoothToForm();
  });
});

// Live updates
[serviceSelect, airportZone, airportVehicle, rentalVehicle, rentalDays]
  .forEach(el => {
    if (el) el.addEventListener("change", updateEstimate);
  });

// Show/hide "Otro destino"
if (airportZone) {
  airportZone.addEventListener("change", () => {
    if (otroDestinoField) {
      otroDestinoField.classList.toggle("hidden", airportZone.value !== "otro");
    }
  });
}

// Set minimum date
const today = new Date().toISOString().split("T")[0];
const fechaInput = document.getElementById("fecha");
if (fechaInput) fechaInput.setAttribute("min", today);

/* =========================================
   FORM SUBMIT
========================================= */

bookingForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const service = serviceSelect.value;
  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;
  const metodoPago = document.getElementById("metodoPago").value;
  const mensaje = document.getElementById("mensaje").value.trim();

  const lines = [
    "🚕 *Nueva Reserva - Jet White*",
    "",
    `📌 *Servicio:* ${SERVICE_LABELS[service]}`,
    `👤 *Nombre:* ${nombre}`,
    `📱 *WhatsApp:* ${telefono}`,
    `📅 *Fecha:* ${fecha}`,
    `⏰ *Hora:* ${hora || "Por confirmar"}`,
    `💰 *Pago:* ${metodoPago}`,
    ""
  ];

  if (service === "aeropuerto") {
    const zoneKey = airportZone.value;
    const zone = AIRPORT_RATES[zoneKey];
    const vehicleType = airportVehicle.value;

    lines.push(`📍 *Destino:* ${zone ? zone.label : "No especificado"}`);
    if (zoneKey === "otro" && otroDestino.value.trim()) {
      lines.push(`📍 *Destino exacto:* ${otroDestino.value.trim()}`);
    }
    lines.push(`🚗 *Vehículo:* ${AIRPORT_VEHICLE_LABELS[vehicleType] || vehicleType}`);
    lines.push(`📍 *Recogida:* ${airportPickup.value.trim() || "No especificada"}`);
    if (flightNumber.value.trim()) {
      lines.push(`✈️ *Vuelo:* ${flightNumber.value.trim()}`);
    }
  } 
  else if (service === "renta") {
    const vehicle = RENTAL_RATES[rentalVehicle.value];
    const days = getRentalDays();

    lines.push(`🚗 *Vehículo:* ${vehicle ? vehicle.label : "No seleccionado"}`);
    lines.push(`📆 *Días:* ${days}`);
    lines.push(`📍 *Entrega:* ${rentalDelivery.value.trim() || "No especificada"}`);
  }

  if (mensaje) {
    lines.push("", `📝 *Nota adicional:* ${mensaje}`);
  }

  const text = encodeURIComponent(lines.join("\n"));

  window.open(`https://wa.me/${PHONE_NUMBER}?text=${text}`, "_blank");
});

/* =========================================
   INIT
========================================= */

populateTimeOptions();
updateServiceUI();
