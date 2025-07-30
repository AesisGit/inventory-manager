function setupInventorySheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sheetsToCreate = [
    {
      name: "Inventory",
      headers: ["Category", "Item", "Holding Stock", "Current", "Difference"],
      sample: [
        ["Spirits", "Vodka", 100, 95],
        ["Spirits", "Rum", 80, 80],
        ["Cans", "Cola", 200, 180]
      ]
    },
    {
      name: "Product Data",
      headers: ["Barcode", "SKU / Ref", "Product"],
      sample: [
        ["123456789012", "SKU001", "Vodka"],
        ["234567890123", "SKU002", "Rum"],
        ["345678901234", "SKU003", "Cola"]
      ]
    },
    {
      name: "Upload",
      headers: ["Barcode", "Product"],
      sample: [
        ["123456789012", ""],
        ["345678901234", ""]
      ]
    },
    {
      name: "Audit Log",
      headers: ["Timestamp", "User Email", "Category", "Item", "Holding Stock", "Current"],
      sample: []
    }
  ];

  sheetsToCreate.forEach(config => {
    let sheet = ss.getSheetByName(config.name);
    if (!sheet) {
      sheet = ss.insertSheet(config.name);
    } else {
      sheet.clear();
    }

    sheet.getRange(1, 1, 1, config.headers.length).setValues([config.headers]);

    if (config.sample.length > 0) {
      sheet.getRange(2, 1, config.sample.length, config.headers.length - (config.name === "Inventory" ? 1 : 0))
        .setValues(config.sample);
    }

    if (config.name === "Inventory") {
      const rowCount = config.sample.length;
      for (let i = 0; i < rowCount; i++) {
        const row = i + 2;
        sheet.getRange(row, 5).setFormula(`=C${row}-D${row}`);
      }
    }

    if (config.name === "Audit Log") {
      sheet.hideSheet();
    }
  });

  const inventorySheet = ss.getSheetByName("Inventory");
  const categories = [
    "Alcohol Free", "Bottles", "Cans", "Cocktail Ingredients", "Consumables",
    "Draught", "Mixers", "Post Mix", "Soft Drink", "OD - 700ml", "OD - 50ml",
    "OD - 20ml", "Spirits", "Wines"
  ];

  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(categories)
    .setAllowInvalid(false)
    .build();
  inventorySheet.getRange("A2:A100").setDataValidation(rule);

  SpreadsheetApp.getUi().alert("✅ All sheets created with sample data, formulas, and dropdowns.");
}
