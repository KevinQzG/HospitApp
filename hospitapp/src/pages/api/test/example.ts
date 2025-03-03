import { NextApiRequest, NextApiResponse } from "next";


export default function handler(req: NextApiRequest, res: NextApiResponse ) {

  if (req.method === "GET") {
    console.log("API funcionando correctamente");
    res.status(200).json({ message: "API funcionando correctamente" });
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}