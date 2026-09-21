const DEFAULT_LIB = {
  systems: [
    {
      id: "gas-furnace",
      name: "Gas furnace maintenance",
      system: "Gas Furnace",
      equipmentHint: "Gas furnace",
      fills: [
        { key: "filter", label: "Filter", def: "customer-supplied filter" },
        { key: "hsi", label: "HSI ohms", def: "" },
        { key: "rise", label: "Temperature rise", def: "" },
        { key: "supplyCO", label: "Supply air CO ppm", def: "" },
        { key: "exhCO", label: "Exhaust CO ppm", def: "" },
        { key: "o2", label: "O2 %", def: "" },
        { key: "co2", label: "CO2 %", def: "" },
        { key: "stack", label: "Stack temp F", def: "" }
      ],
      bullets: [
        "Visual Inspection: Inspected furnace cabinet, surrounding area, and overall condition. No issues noted.",
        "Air Filter: Inspected and replaced {filter}.",
        "Burners / Ignition: Inspected burners and confirmed proper flame characteristics. Cleaned flame sensor.{hsiLine}",
        "Heat Exchanger: Visually inspected for cracks, corrosion, and signs of failure. No defects observed.",
        "Blower Assembly: Inspected blower housing and wheel. No debris, damage, or imbalance noted.",
        "Inducer Motor & Venting: Inspected inducer motor, flue pipe, and vent system. No leaks or restrictions found.",
        "Condensate System: Flushed condensate lines and condensate trap. Tested and inspected condensate pump. Verified proper drainage.",
        "Gas System: Checked gas lines, connections, and gas valve for leaks. No leaks detected.",
        "Electrical & Controls: Inspected wiring and connections. Operated unit from thermostat. Controls responding normally.",
        "Safety Devices: Inspected limit switches and pressure switches. All functioning as designed.",
        "System Test / Combustion: Ran full heating-mode operational test long enough for stable combustion readings. Unit is operating properly at this time."
      ],
      extras: [
        "(Temperature rise: {rise})",
        "(Supply air CO: {supplyCO})",
        "(Exhaust combustion: CO {exhCO}, O2 {o2}, CO2 {co2}, stack temp {stack})"
      ]
    },
    {
      id: "coil-condenser",
      name: "Coil and condenser maintenance",
      system: "AC",
      equipmentHint: "Coil and condenser",
      fills: [
        { key: "cap", label: "Capacitor reading / rated", def: "" },
        { key: "delta", label: "Delta T F", def: "" }
      ],
      bullets: [
        "Visual Inspection: Inspected outdoor condenser and indoor coil for damage, corrosion, debris, proper clearance, and level installation. Inspected surrounding area and line set.",
        "Condenser / Coil (Outdoor): Inspected wiring and contactor.{capLine} Cleaned condenser unit, fan, and coil with hose.",
        "Evaporator Coil (Indoor): Inspected and cleaned coil.",
        "Condensate Drain: Inspected, cleaned, and flushed drain lines, pan, and trap. Verified proper drainage.",
        "Refrigerant System: Inspected line set insulation and visible connections for leaks. No leaks noted.",
        "Electrical & Controls: Inspected wiring, connections, and disconnect box.",
        "System Test: Ran full operational test in cooling mode from the thermostat. Unit is operating properly at this time."
      ],
      extras: ["(Delta T: {delta})"]
    },
    {
      id: "coil-hp",
      name: "Coil and Heat Pump Maintenance",
      system: "Heat Pump",
      equipmentHint: "Coil and heat pump",
      fills: [
        { key: "cap", label: "Capacitor reading / rated", def: "" },
        { key: "delta", label: "Temperature differential / Delta T", def: "" }
      ],
      bullets: [
        "Visual Inspection: Inspected outdoor unit and indoor coil for damage, corrosion, debris, proper clearance, and level installation. Inspected surrounding area and line set.",
        "Outdoor Unit / Coil: Inspected wiring and contactor.{capLine} Cleaned outdoor unit, fan, and coil with hose.",
        "Indoor Coil: Inspected and cleaned coil.",
        "Condensate Drain: Inspected, cleaned, and flushed drain lines, pan, and trap. Verified proper drainage.",
        "Refrigerant System: Inspected line set insulation and visible connections for leaks. No leaks noted.",
        "Electrical and Controls: Inspected wiring, connections, and disconnect box.",
        "System Test: Ran full operational test in cooling mode from the thermostat. Unit is operating properly at this time."
      ],
      extras: ["(Temperature differential / Delta T: {delta})"]
    },
    {
      id: "air-handler-hp",
      name: "Air Handler + Heat Pump",
      system: "Heat Pump",
      equipmentHint: "Air handler + heat pump",
      fills: [],
      bullets: [
        "Visual Inspection: Inspected indoor air handler and outdoor unit for overall system condition.",
        "Air Filter: Inspected and replaced air filter.",
        "Indoor / Outdoor Coils: Inspected and cleaned coils.",
        "Condensate System: Inspected, cleaned, and flushed drain lines, pan, and trap. Tested and inspected the condensate pump.",
        "Blower / Fan Assembly: Inspected blower wheel, motor, and outdoor fan for proper operation, cleanliness, and balance.",
        "Electrical & Controls: Inspected wiring, connections, and disconnect box. Verified thermostat operation. Checked for error codes.",
        "Refrigerant System: Inspected line set and checked for leaks. No leaks noted.",
        "System Test: Ran full operational test in heating and cooling modes. Unit is operating properly at this time."
      ],
      extras: []
    },
    {
      id: "ductless",
      name: "Ductless + Heat Pump (1:1)",
      system: "Ductless",
      equipmentHint: "Ductless + heat pump",
      fills: [],
      bullets: [
        "Visual Inspection: Inspected indoor heads and outdoor unit for overall system condition.",
        "Air Filter: Inspected and cleaned air filters.",
        "Indoor Head: Inspected and cleaned coils. Inspected blower wheels. Cleaned covers and louvers.",
        "Condensate System: Inspected and flushed drain lines and drain pans. Verified proper drainage.",
        "Outdoor Unit: Inspected and cleaned coil, fan, and covers.",
        "Electrical & Controls: Inspected wiring, connections, and disconnect box.",
        "Refrigerant System: Inspected line set and checked for leaks. No leaks noted.",
        "System Test: Ran full operational test in cooling mode. Unit is operating properly at this time."
      ],
      extras: []
    },
    {
      id: "he-boiler",
      name: "High Efficiency Boiler",
      system: "Boiler",
      equipmentHint: "High efficiency boiler",
      fills: [],
      bullets: [
        "Visual Inspection: Inspected boiler exterior, jacket, and surrounding area for leaks, corrosion, damage, and proper clearance. Verified combustion air supply.",
        "Burner / Ignition: Inspected burner and confirmed proper flame characteristics. Cleaned flame sensor and ignition electrode.",
        "Heat Exchanger: Inspected and cleaned heat exchanger.",
        "Condensate System: Inspected, cleaned, and flushed condensate trap, line, and drain. Verified proper drainage.",
        "Circulator Pump: Inspected pump operation.",
        "Expansion Tank / Air Vent: Inspected expansion tank and air vent. Checked for leaks.",
        "Venting System: Inspected vent pipe, fittings, termination, and pitch. Inspected venting from outside.",
        "Gas System: Checked gas lines, connections, and gas valve for leaks. No leaks detected.",
        "Controls & Safety Devices: Inspected pressure relief valve, low water cutoff, pressure switches, and other safeties.",
        "Electrical & Controls: Inspected wiring, connections, and control board.",
        "System Test: Ran full operational test in heating mode. Verified proper ignition, circulation, and temperature rise. Took combustion readings. Checked for CO around the heat exchanger, unit, and venting. Unit is operating properly at this time."
      ],
      extras: []
    },
    {
      id: "gas-boiler",
      name: "Gas Boiler",
      system: "Boiler",
      equipmentHint: "Gas boiler",
      fills: [],
      bullets: [
        "Visual Inspection: Inspected boiler exterior, jacket, and surrounding area for leaks, corrosion, damage, and proper clearance. Verified combustion air supply.",
        "Burner Assembly: Inspected burner and confirmed proper flame characteristics.",
        "Heat Exchanger: Inspected and cleaned heat exchanger.",
        "Circulator Pump: Inspected pump operation.",
        "Expansion Tank / Air Vent: Inspected expansion tank and air vent. Checked for leaks.",
        "Venting System: Inspected vent pipe and termination.",
        "Gas System: Checked gas lines, connections, and gas valve for leaks. No leaks detected.",
        "Controls & Safety Devices: Inspected aquastat, pressure relief valve, low water cutoff, rollout switch, and other safeties.",
        "Electrical & Controls: Inspected wiring, transformer, and control board.",
        "System Test: Ran full operational test in heating mode. Verified proper ignition, circulation, and temperature rise. Took combustion readings. Unit is operating properly at this time."
      ],
      extras: []
    },
    {
      id: "combi",
      name: "Combi Boiler",
      system: "Boiler",
      equipmentHint: "Combi boiler",
      fills: [],
      bullets: [
        "Visual Inspection: Inspected exterior for leaks, corrosion, and proper clearances. Inspected surrounding area.",
        "Inlet Water Filter: Removed and cleaned filter casing. Inspected and cleaned inlet water filter.",
        "Air Intake Filter + DHW Screen: Inspected and cleaned air intake screen. Inspected and cleaned the domestic hot water screen.",
        "Condensate System: Inspected, cleaned, and flushed condensate trap, line, and drain.",
        "Heat Exchanger: Inspected and flushed domestic heat exchanger.",
        "Burner / Ignition: Inspected burner. Cleaned flame rod and ignition electrode.",
        "Gas System: Checked gas lines, shut-off valve, and connections for leaks. No leaks detected.",
        "Venting System: Inspected vent pipe, fittings, termination, and pitch. Inspected venting from outside.",
        "Components: Inspected circulator pump, air vents, and expansion tank.",
        "Electrical & Controls: Inspected wiring, connections, and control board.",
        "Safety Devices: Inspected pressure relief valves.",
        "System Test: Ran full operational test in heating mode. Verified supply and return heat. Tested domestic hot water operation. Took combustion readings. Checked for CO around the heat exchanger, unit, and venting. Unit is operating properly at this time."
      ],
      extras: []
    },
    {
      id: "wh-gas",
      name: "Tank Water Heater (Gas)",
      system: "Other",
      equipmentHint: "Gas tank water heater",
      fills: [
        { key: "baseCO", label: "Basement CO ppm", def: "" },
        { key: "exhCO", label: "Exhaust CO ppm", def: "" },
        { key: "o2", label: "O2 %", def: "" },
        { key: "stack", label: "Stack temp F", def: "" }
      ],
      bullets: [
        "Visual Inspection: Inspected all piping and the exterior tank for leaks and corrosion. Verified proper clearance and surrounding area safety.",
        "Tank Flush: Drained and flushed sediment from the bottom of the tank. Refilled the tank while purging air from the faucets.",
        "Temperature & Pressure Relief (T&P) Valve: Tested for proper operation and inspected discharge pipe condition.",
        "Burner Assembly: Inspected burner plate and ignition.",
        "Gas System: Checked gas supply lines, shut-off valve, regulator, and connections for leaks. No leaks detected.",
        "Venting System: Inspected vent pipe and termination.",
        "Electrical Components: Inspected wiring, connections, power vent motor, and safety devices.",
        "System Test: Ran full operational test and took combustion readings. Unit is operating properly at this time."
      ],
      extras: [
        "(Basement CO: {baseCO})",
        "(Exhaust CO: {exhCO})",
        "(O2: {o2})",
        "(Stack temp: {stack})"
      ]
    },
    {
      id: "wh-elec",
      name: "Tank Water Heater (Electric)",
      system: "Other",
      equipmentHint: "Electric tank water heater",
      fills: [
        { key: "volts", label: "Supply voltage", def: "" },
        { key: "upper", label: "Upper element ohms", def: "" },
        { key: "lower", label: "Lower element ohms", def: "" },
        { key: "temp", label: "Hot water temp F", def: "" }
      ],
      bullets: [
        "Visual Inspection: Inspected all piping and the exterior tank for leaks and corrosion. Verified proper clearance and surrounding area safety.",
        "Tank Flush: Drained and flushed sediment from the bottom of the tank. Refilled the tank while purging air from the faucets.",
        "Temperature & Pressure Relief (T&P) Valve: Tested for proper operation and inspected discharge pipe condition.",
        "Anode Rod: Inspected anode rod for wear and remaining sacrificial material. Condition acceptable at this time.",
        "Heating Elements: Inspected upper and lower elements for scale, leaks at the ports, and proper resistance. Elements within range.",
        "Thermostats: Inspected upper and lower thermostats and high-limit (ECO). Settings verified. Reset intact.",
        "Electrical & Controls: Inspected wiring, connections, junction cover, and breaker/disconnect. No loose connections or heat damage noted.",
        "System Test: Restored power and ran full operational test. Unit is operating properly at this time."
      ],
      extras: [
        "(Supply voltage: {volts})",
        "(Upper element: {upper})",
        "(Lower element: {lower})",
        "(Hot water temp: {temp})"
      ]
    },
    {
      id: "tankless",
      name: "Tankless Water Heater",
      system: "Other",
      equipmentHint: "Tankless water heater",
      fills: [],
      bullets: [
        "Visual Inspection: Inspected exterior for leaks, corrosion, and proper clearances. Inspected surrounding area.",
        "Inlet Water Filter: Removed and cleaned filter casing. Inspected and cleaned inlet water filter.",
        "Air Intake Filter + DHW Screen: Inspected and cleaned air intake screen. Inspected and cleaned the domestic hot water screen.",
        "Condensate System: Inspected, cleaned, and flushed condensate trap, line, and drain.",
        "Heat Exchanger: Inspected and cleaned/flushed heat exchanger.",
        "Burner / Ignition: Inspected burner. Cleaned flame rod and ignition electrode.",
        "Gas System: Checked gas lines, shut-off valve, and connections for leaks. No leaks detected.",
        "Venting System: Inspected vent pipe, fittings, termination, and pitch. Inspected venting from outside.",
        "Electrical & Controls: Inspected wiring, connections, and control board.",
        "Safety Devices: Inspected pressure relief valve.",
        "System Test: Ran full operational test. Tested domestic hot water operation. Took combustion readings. Checked for CO around the heat exchanger, unit, and venting. Unit is operating properly at this time."
      ],
      extras: []
    },
    {
      id: "hpwh",
      name: "Heat Pump Water Heater",
      system: "Other",
      equipmentHint: "Heat pump water heater",
      fills: [],
      bullets: [
        "Visual Inspection: Inspected all piping and the exterior tank for leaks and corrosion. Verified proper clearance and surrounding area safety.",
        "Tank Flush: Drained and flushed sediment from the bottom of the tank. Refilled the tank while purging air from the faucets.",
        "Temperature & Pressure Relief (T&P) Valve: Tested for proper operation and inspected discharge pipe condition.",
        "Heating Elements: Inspected and tested upper and lower elements.",
        "Filter / Condensate: Cleaned filter and inspected fan. Inspected coil, condensate pan, and drain line. Tested and inspected condensate pump.",
        "Electrical & Controls: Inspected wiring and connections.",
        "System Test: Ran full operational test. Unit is operating properly at this time."
      ],
      extras: []
    },
    {
      id: "humidifier",
      name: "Humidifier",
      system: "Other",
      equipmentHint: "Humidifier",
      fills: [],
      bullets: [
        "Visual Inspection: Inspected cabinet, housing, duct connections, and overall installation for leaks, corrosion, damage, or mineral buildup. Verified placement and airflow integration with the HVAC system.",
        "Water Panel: Removed, inspected, and replaced the water panel.",
        "Reservoir / Tray: Cleaned reservoir and tray.",
        "Drain Line: Inspected, cleaned, and flushed drain line.",
        "Solenoid Valve & Water Supply: Inspected solenoid valve and tested water supply.",
        "Humidistat / Controls: Inspected humidistat, wiring, and control settings. Verified operation with the HVAC system running.",
        "Fan / Bypass Damper: Inspected fan motor and damper operation where equipped.",
        "System Test: Ran full operational test with the HVAC system on. Verified water flow, evaporation, and humidity output. No leaks noted. Unit is operating properly at this time."
      ],
      extras: []
    },
    {
      id: "sanidry",
      name: "Sanidry Dehumidifier",
      system: "Other",
      equipmentHint: "Sanidry dehumidifier",
      fills: [],
      bullets: [
        "Visual Inspection: Inspected cabinet, housing, and overall installation for leaks, corrosion, damage, or buildup. Verified proper clearance for airflow. Verified level for drainage and airflow integration with the HVAC system.",
        "Filter / Coil: Inspected and cleaned the coil. Flushed the drain pan. Inspected and replaced the filter.",
        "Internal Components: Inspected wiring, fan, and compressor.",
        "Drain Line: Inspected and flushed drain tube and drain line. Verified proper drainage.",
        "System Test: Verified unit is pulling moisture from the air and draining properly. No unusual noises or leaks present. Unit is operating properly at this time."
      ],
      extras: []
    },
    {
      id: "erv",
      name: "ERV",
      system: "Other",
      equipmentHint: "ERV",
      fills: [],
      bullets: [
        "Visual Inspection: Inspected cabinet, housing, duct connections, and overall installation.",
        "Filters / Cabinet: Removed, inspected, and cleaned pre-filters and box filter. Cleaned inside cabinet. Inspected inside ductwork.",
        "Venting: Inspected outdoor venting and cleaned screens.",
        "Drain Line: Inspected and flushed drain line.",
        "Electrical & Controls: Inspected wiring and controller. Verified proper communication.",
        "System Test: Tested system operation and verified proper airflow. No unusual sounds or leaks present. Unit is operating properly at this time."
      ],
      extras: []
    },
    {
      id: "service-blank",
      name: "Service - custom (no prepaid formula)",
      system: "Service",
      equipmentHint: "",
      fills: [],
      bullets: [],
      extras: []
    }
  ]
};
