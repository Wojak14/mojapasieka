export function getIcons(text) {
  let icons = [];

  if (!text) return ["📒"];

  if (t.includes("miód") || t.includes("miodobranie")) icons.push("🫙");
  if (t.includes("karmienie") || t.includes("syrop") || t.includes("ciasto")) icons.push("🍯");
  if (t.includes("leczenie") || t.includes("apiwarol")) icons.push("💊");
  if (t.includes("paski")) icons.push("🏷️");
  if (t.includes("kwas")) icons.push("🌬️");
  if (t.includes("zakończenie leczenia")) icons.push("🛡️");
  if (t.includes("przegląd") || t.includes("inspekcja")) icons.push("🔍");
  if (t.includes("sprawdzenie")) icons.push("📋");
  if (t.includes("rój") || t.includes("rójka")) icons.push("🐝");
  if (t.includes("pożytek") || t.includes("nektar") || t.includes("pyłek")) icons.push("🌸");
  if (t.includes("matka") || t.includes("wymiana matki")) icons.push("👑");
  if (t.includes("ramka")) icons.push("🧱");
  if (t.includes("nadstawka")) icons.push("📦");

  if (t.includes("deszcz")) icons.push("🌧️");
  if (t.includes("wiatr")) icons.push("💨");
  if (t.includes("burza")) icons.push("🌩️");
  if (t.includes("śnieg")) icons.push("❄️");

  if (t.includes("mróz") || t.includes("zimno")) icons.push("🥶");
  if (t.includes("upał") || t.includes("gorąco")) icons.push("🥵");

  if (t.includes("pochmurno")) icons.push("🌫️");
  if (t.includes("słonecznie")) icons.push("☀️");
  if (t.includes("mgła")) icons.push("🌁");
  if (t.includes("grad")) icons.push("🧊");

  if (t.includes("czerw")) icons.push("🐣");
  if (t.includes("trutnie")) icons.push("👨‍🌾");

  if (t.includes("dzikie pszczoły")) icons.push("🐝🌿");
  if (t.includes("odsklepianie") || t.includes("miotła")) icons.push("🧹");
  if (t.includes("dezynfekcja")) icons.push("🧴");
  if (t.includes("ucieczka pszczół")) icons.push("🏃‍♂️🐝");
  if (t.includes("węza")) icons.push("🧇");
  if (t.includes("ule") || t.includes("pasieka")) icons.push("🏠");

  return icons.length ? icons : ["📒"];
}
