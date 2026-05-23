const PHONE_NUMBER = "18094266236";

/* =========================================
   LABELS
========================================= */
const SERVICE_LABELS = {
  aeropuerto: "Taxi Aeropuerto",
  renta: "Rent a Car"
};

const AIRPORT_VEHICLE_LABELS = {
  carro: "Carro (1-4 pax)",
  vanxl: "Van XL (5-7 pax)",
  xxl: "Van XXL (+8 pax)"
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
const rentalVehicle = document.getElementById("rentaVehiculo");
const rentalDays = document.getElementById("rentaDias");
const rentalDelivery = document.getElementById("rentaEntrega");
const estimateTitle = document.getElementById("estimateTitle");
const estimateText = document.getElementById("estimateText");
const bookingForm = document.getElementById("bookingForm");
const fechaInput = document.getElementById("fecha");
const timeSelect = document.getElementById("hora");
const paymentMethod = document.getElementById("metodoPago");
const mensajeTextarea = document.getElementById("mensaje");

/* =========================================
   HELPERS
========================================= */
function money(value) {
  return `US$${value}`;
}

function setGroupVisible(group, visible) {
  if (group) group.classList.toggle("hidden", !visible);
}

function getRentalDays() {
  return Math.max(1, parseInt(rentalDays?.value || "1", 10));
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
      const time = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      option.value = time;
      option.textContent = time;
      timeSelect.appendChild(option);
    });
  }
}

/* =========================================
   PRICE CALCULATION
========================================= */
function getAirportRateText(selectedAirport, vehicleType) {
  if (!selectedAirport) return "Selecciona destino";
  if (vehicleType === "xxl" || selectedAirport[vehicleType] == null) {
    return "Cotizar por WhatsApp";
  }
  return money(selectedAirport[vehicleType]);
}

function getRentalPricing(days) {
  if (days <= 2) {
    return { text: `US$60/día — Total: ${money(days * 60)}` };
  }
  if (days >= 3 && days <= 5) {
    return { text: `US$50–55/día (confirmar)` };
  }
  return { text: "Tarifa especial por más días (consultar)" };
}

/* =========================================
   UPDATE ESTIMATE
========================================= */
function updateEstimate() {
  if (!estimateTitle || !estimateText) return;

  const service = serviceSelect.value;

  if (service === "aeropuerto") {
    const selectedAirport = AIRPORT_RATES[airportZone.value];
    const vehicleType = airportVehicle.value || "carro";
    const vehicleLabel = AIRPORT_VEHICLE_LABELS[vehicleType];
    const rateText = getAirportRateText(selectedAirport, vehicleType);

    estimateTitle.textContent = "Traslado Aeropuerto";
    estimateText.textContent = selectedAirport
      ? `${selectedAirport.label} • ${vehicleLabel}: ${rateText}`
      : "Selecciona destino y vehículo";
  } 
  else if (service === "renta") {
    const selectedVehicle = RENTAL_RATES[rentalVehicle.value];
    const days = getRentalDays();
    const pricing = getRentalPricing(days);

    estimateTitle.textContent = "Rent a Car";
    estimateText.textContent = `${selectedVehicle?.label || "Vehículo"} • ${pricing.text}`;
  }
}

/* =========================================
   UPDATE UI
========================================= */
function updateServiceUI() {
  const service = serviceSelect.value;

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
   EVENT LISTENERS
========================================= */
serviceButtons.forEach(button => {
  button.addEventListener("click", () => {
    serviceSelect.value = button.dataset.service;
    updateServiceUI();
  });
});

// Catalog buttons
document.querySelectorAll(".catalog-reserve").forEach(btn => {
  btn.addEventListener("click", () => {
    serviceSelect.value = "renta";
    if (rentalVehicle) rentalVehicle.value = btn.dataset.rental;
    updateServiceUI();
    bookingForm.scrollIntoView({ behavior: "smooth" });
  });
});

// Live updates
[serviceSelect, airportZone, airportVehicle, rentalVehicle, rentalDays].forEach(el => {
  if (el) {
    el.addEventListener("change", updateServiceUI);
    el.addEventListener("input", updateServiceUI);
  }
});

/* =========================================
   FORM SUBMIT → WhatsApp
========================================= */
bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const service = serviceSelect.value;
  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const fecha = fechaInput.value;
  const hora = timeSelect.value;
  const metodoPago = paymentMethod.value;
  const mensaje = mensajeTextarea.value.trim();

  let lines = [
    "🚕 *Nueva Reserva - Jet White*",
    "",
    `📌 *Servicio:* ${SERVICE_LABELS[service]}`,
    `👤 *Nombre:* ${nombre}`,
    `📱 *WhatsApp:* ${telefono}`,
    `📅 *Fecha:* ${fecha}`,
    `⏰ *Hora:* ${hora || "Pendiente"}`,
    `💰 *Pago:* ${metodoPago}`,
    ""
  ];

  if (service === "aeropuerto") {
    const airport = AIRPORT_RATES[airportZone.value];
    lines.push(`🛫 *Destino:* ${airport ? airport.label : "No especificado"}`);
    lines.push(`🚗 *Vehículo:* ${AIRPORT_VEHICLE_LABELS[airportVehicle.value] || "Carro"}`);
    lines.push(`📍 *Recogida:* ${airportPickup.value.trim() || "No especificada"}`);
    if (flightNumber.value.trim()) lines.push(`✈️ *Vuelo:* ${flightNumber.value.trim()}`);
  } 
  else if (service === "renta") {
    const vehicle = RENTAL_RATES[rentalVehicle.value];
    const days = getRentalDays();
    lines.push(`🚙 *Vehículo:* ${vehicle ? vehicle.label : "No seleccionado"}`);
    lines.push(`📆 *Días:* ${days}`);
    lines.push(`📍 *Entrega:* ${rentalDelivery.value.trim() || "No especificada"}`);
  }

  if (mensaje) {
    lines.push("");
    lines.push(`📝 *Nota adicional:* ${mensaje}`);
  }

  const text = encodeURIComponent(lines.join("\n"));
  window.open(`https://wa.me/${PHONE_NUMBER}?text=${text}`, "_blank");
});

/* =========================================
   INIT
========================================= */
document.addEventListener("DOMContentLoaded", () => {
  // Set minimum date (today)
  const today = new Date().toISOString().split("T")[0];
  if (fechaInput) fechaInput.min = today;

  populateTimeOptions();
  updateServiceUI();
});
