import http from "./httpService";

const apiUrl = process.env.REACT_APP_API_URL + "/festivals";

async function getFestivals() {
  const data = await http.get(apiUrl);
  return data;
}

export default { getFestivals };
