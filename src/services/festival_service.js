import http from "./http_service";

const apiUrl = process.env.API_URL + "/festivals";

async function getFestivals() {
  const data = await http.get(apiUrl);
  return data;
}

export default { getFestivals };
