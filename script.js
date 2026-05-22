const PHONE_NUMBER = "18094266236";

/* =========================================
   LABELS
========================================= */

const SERVICE_LABELS = {
  aeropuerto: "Aeropuerto",
  renta: "Rent a Car"
};

const AIRPORT_VEHICLE_LABELS = {
  carro: "Carro",
  vanxl: "Van XL",
  xxl: "Van XXL (8+ pasajeros)"
};

/* =========================================
   RENTAL VEHICLES
========================================= */

const RENTAL_RATES = {
  "kia-seltos-2025": {
    label: "Kia Seltos 2025"
  },

  "hyundai-creta-2023": {
    label: "Hyundai Creta 2023"
  },

  "honda-crv-2025": {
    label: "Honda CR-V 2025"
  },

  "kia-sorento": {
    label: "Kia Sorento"
  },

  "maserati-2021": {
    label: "Maserati Ghibli 2021"
  }
};

/* =========================================
   AIRPORT RATES
========================================= */

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

/* =========================================
   ELEMENTS
========================================= */

const serviceSelect =
  document.getElementById("servicio");

const serviceButtons =
  document.querySelectorAll(".service-option");

const formServiceBadge =
  document.getElementById("formServiceBadge");

const passengerField =
  document.getElementById("passengerField");

const airportFields =
  document.getElementById("airportFields");

const rentalFields =
  document.getElementById("rentalFields");

const airportZone =
  document.getElementById("aeropuertoZona");

const airportVehicle =
  document.getElementById("aeropuertoVehiculo");

const airportDirection =
  document.getElementById("aeropuertoSentido");

const airportPickup =
  document.getElementById("airportPickup");

const flightNumber =
  document.getElementById("flightNumber");

const airportDropoff =
  document.getElementById("airportDropoff");

const rentalVehicle =
  document.getElementById("rentaVehiculo");

const rentalDays =
  document.getElementById("rentaDias");

const rentalDelivery =
  document.getElementById("rentaEntrega");

const estimateTitle =
  document.getElementById("estimateTitle");

const estimateText =
  document.getElementById("estimateText");

const bookingForm =
  document.getElementById("bookingForm");

const timeSelect =
  document.getElementById("hora");

const paymentMethod =
  document.getElementById("metodoPago");

/* =========================================
   HELPERS
========================================= */

function money(value) {
  return `US$${value}`;
}

function smoothToForm() {

  bookingForm.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function getRentalDays() {

  return Math.max(
    1,
    parseInt(rentalDays.value || "1", 10)
  );
}

function setGroupVisible(group, visible) {

  if (!group) return;

  group.classList.toggle(
    "hidden",
    !visible
  );
}

/* =========================================
   TIME FORMAT
========================================= */

function formatTime(hour, minutes) {

  const hourStr =
    String(hour).padStart(2, "0");

  const minuteStr =
    String(minutes).padStart(2, "0");

  return `${hourStr}:${minuteStr}`;
}

function populateTimeOptions() {

  if (!timeSelect) return;

  timeSelect.innerHTML =
    '<option value="">Selecciona una hora</option>';

  for (let hour = 0; hour < 24; hour++) {

    [0, 30].forEach(minutes => {

      const option =
        document.createElement("option");

      const formattedTime =
        formatTime(hour, minutes);

      option.value =
        formattedTime;

      option.textContent =
        formattedTime;

      timeSelect.appendChild(option);
    });
  }
}

/* =========================================
   RENTAL PRICE
========================================= */

function getRentalPricing(days) {

  if (days <= 2) {

    return {
      type: "fixed",
      total: days * 60,
      text:
        `US$60/día — Total: ${money(days * 60)}`
    };
  }

  if (days > 5) {

    return {
      type: "custom",
      text:
        "Más de 5 días: tarifa personalizada vía WhatsApp."
    };
  }

  return {
    type: "custom",
    text:
      "Tarifa confirmada vía WhatsApp."
  };
}

/* =========================================
   AIRPORT PRICE
========================================= */

function getAirportRateText(
  selectedAirport,
  vehicleType
) {

  if (!selectedAirport) {
    return "Pendiente";
  }

  if (
    vehicleType === "xxl" ||
    selectedAirport[vehicleType] == null
  ) {

    return "Cotizar por WhatsApp";
  }

  return money(
    selectedAirport[vehicleType]
  );
}

/* =========================================
   UPDATE UI
========================================= */

function updateServiceUI() {

  const service =
    serviceSelect.value;

  serviceButtons.forEach(button => {

    button.classList.toggle(
      "active",
      button.dataset.service === service
    );
  });

  if (formServiceBadge) {

    formServiceBadge.textContent =
      SERVICE_LABELS[service];
  }

  if (passengerField) {

    passengerField.classList.toggle(
      "hidden",
      service === "renta"
    );
  }

  setGroupVisible(
    airportFields,
    service === "aeropuerto"
  );

  setGroupVisible(
    rentalFields,
    service === "renta"
  );

  updateEstimate();
}

/* =========================================
   ESTIMATE
========================================= */

function updateEstimate() {

  const service =
    serviceSelect.value;

  if (
    !estimateTitle ||
    !estimateText
  ) return;

  /* AIRPORT */

  if (service === "aeropuerto") {

    const selectedAirport =
      AIRPORT_RATES[airportZone.value];

    const vehicleType =
      airportVehicle.value || "carro";

    const vehicleLabel =
      AIRPORT_VEHICLE_LABELS[vehicleType];

    const rateText =
      getAirportRateText(
        selectedAirport,
        vehicleType
      );

    estimateTitle.textContent =
      "Traslado al aeropuerto";

    estimateText.textContent =
      selectedAirport
        ? `${selectedAirport.label} en ${vehicleLabel}: ${rateText}`
        : "Selecciona destino y vehículo.";

    return;
  }

  /* RENT CAR */

  if (service === "renta") {

    const selectedVehicle =
      RENTAL_RATES[rentalVehicle.value];

    const days =
      getRentalDays();

    const pricing =
      getRentalPricing(days);

    estimateTitle.textContent =
      "Rent a Car";

    estimateText.textContent =
      `${selectedVehicle.label}. ${pricing.text}`;
  }
}

/* =========================================
   BUTTON EVENTS
========================================= */

serviceButtons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      serviceSelect.value =
        button.dataset.service;

      updateServiceUI();

      smoothToForm();
    }
  );
});

/* =========================================
   CATALOG EVENTS
========================================= */

document
  .querySelectorAll(".catalog-reserve")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        serviceSelect.value =
          "renta";

        rentalVehicle.value =
          button.dataset.rental;

        updateServiceUI();

        smoothToForm();
      }
    );
  });

/* =========================================
   LIVE EVENTS
========================================= */

[
  serviceSelect,
  airportZone,
  airportVehicle,
  rentalVehicle,
  rentalDays
].forEach(field => {

  if (!field) return;

  field.addEventListener(
    "change",
    updateServiceUI
  );

  field.addEventListener(
    "input",
    updateServiceUI
  );
});

/* =========================================
   DATE MIN
========================================= */

const today =
  new Date()
    .toISOString()
    .split("T")[0];

document
  .getElementById("fecha")
  .setAttribute("min", today);

/* =========================================
   INIT TIMES
========================================= */

populateTimeOptions();

/* =========================================
   FORM SUBMIT
========================================= */

bookingForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();

    const service =
      serviceSelect.value;

    const nombre =
      document
        .getElementById("nombre")
        .value
        .trim();

    const telefono =
      document
        .getElementById("telefono")
        .value
        .trim();

    const pasajeros =
      document
        .getElementById("pasajeros")
        .value
        .trim();

    const fecha =
      document
        .getElementById("fecha")
        .value
        .trim();

    const hora =
      document
        .getElementById("hora")
        .value
        .trim();

    const mensaje =
      document
        .getElementById("mensaje")
        .value
        .trim();

    const lines = [

      "Hola, quiero hacer una reserva con Jet White.",

      "",

      `Servicio: ${SERVICE_LABELS[service]}`,

      `Nombre: ${nombre}`,

      `WhatsApp: ${telefono}`,

      `Fecha: ${fecha}`,

      `Hora: ${hora}`,

      `Método de pago: ${paymentMethod.value}`
    ];

    /* AIRPORT */

    if (service === "aeropuerto") {

      const selectedAirport =
        AIRPORT_RATES[airportZone.value];

      const vehicleType =
        airportVehicle.value;

      const vehicleLabel =
        AIRPORT_VEHICLE_LABELS[vehicleType];

      const rateText =
        getAirportRateText(
          selectedAirport,
          vehicleType
        );

      lines.push(
        `Pasajeros: ${pasajeros || "1"}`
      );

      lines.push(
        `Destino: ${selectedAirport?.label || "No especificado"}`
      );

      lines.push(
        `Vehículo: ${vehicleLabel}`
      );

      lines.push(
        `Traslado: ${airportDirection.value}`
      );

      lines.push(
        `Tarifa: ${rateText}`
      );

      lines.push(
        `Vuelo: ${
          flightNumber.value.trim()
          || "No especificado"
        }`
      );

      lines.push(
        `Recogida: ${
          airportPickup.value.trim()
          || "No especificada"
        }`
      );

      lines.push(
        `Destino exacto: ${
          airportDropoff.value.trim()
          || "No especificado"
        }`
      );
    }

    /* RENT CAR */

    if (service === "renta") {

      const selectedVehicle =
        RENTAL_RATES[
          rentalVehicle.value
        ];

      const days =
        getRentalDays();

      const pricing =
        getRentalPricing(days);

      lines.push(
        `Vehículo: ${selectedVehicle.label}`
      );

      lines.push(
        `Días: ${days}`
      );

      lines.push(
        `Entrega: ${
          rentalDelivery.value.trim()
          || "No especificada"
        }`
      );

      if (pricing.type === "fixed") {

        lines.push(
          `Total: ${money(pricing.total)}`
        );

      } else {

        lines.push(
          `Tarifa: ${pricing.text}`
        );
      }
    }

    lines.push(
      `Nota adicional: ${
        mensaje || "Ninguna"
      }`
    );

    const text =
      encodeURIComponent(
        lines.join("\n")
      );

    window.open(
      `https://wa.me/${PHONE_NUMBER}?text=${text}`,
      "_blank"
    );
  }
);

/* =========================================
   INIT
========================================= */

updateServiceUI();
