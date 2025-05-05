/* eslint-disable no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import CONTAINER from "@/adapters/container";
import IpsServiceAdapter from "@/adapters/services/ips.service.adapter";
import { TYPES } from "@/adapters/types";

// define ips data structure
export interface Ips {
  _id?: string; // Identificador único de la IPS (opcional)
  department: string; // Departamento donde se encuentra la IPS
  town: string; // Ciudad o municipio donde se encuentra la IPS
  name: string; // Nombre de la IPS
  address: string; // Dirección física de la IPS
  phone: string; // Número de teléfono de contacto
  email: string; // Correo electrónico de contacto
  eps?: string; // EPS asociadas (opcional)
  location: {
    type: "Point"; // Tipo de dato para la ubicación (siempre "Point")
    coordinates: [number, number]; // Coordenadas [longitud, latitud]
  };
}

// endpoint to create a new ips
export async function POST(request: NextRequest) {
  // Obtener el cuerpo de la solicitud en formato JSON
  const body = await request.json();

  // Get the data from the request body
  const { department, town, address, name, phone, email } = body.ips;

  //validete that all required fields are present
  if (!name || !address || !phone || !department || !town || !email) {
    return NextResponse.json(
      { message: "Faltan campos obligatorios para crear la IPS." },
      { status: 400 }
    );
  }

  // Obtener el servicio de IPS desde el contenedor de inyección de dependencias
  const service = CONTAINER.get<IpsServiceAdapter>(TYPES.IpsServiceAdapter);

  try {
    // try to create the IPS using the service
    const newIps = await service.create(body.ips);

    // retrun the created IPS with status 201 (Created)
    return NextResponse.json(newIps, { status: 201 });
  } catch (error) {
    // Register the error in the console with a more descriptive message
    console.error("Error al crear la IPS:", error);
    // return server error message with status 500 (Internal Server Error)
    return NextResponse.json(
      { message: "No se pudo crear la IPS debido a un error en el servidor." },
      { status: 500 }
    );
  }
}

// Endpoint DELETE to delete an existing IPS
export async function DELETE(request: NextRequest) {
  // get the ID from the request URL
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "Se requiere el ID para eliminar la IPS." },
      { status: 400 }
    );
  }

  const service = CONTAINER.get<IpsServiceAdapter>(TYPES.IpsServiceAdapter);

  try {
    // Intentar eliminar la IPS usando el servicio
    const deleted = await service.delete(id);

    // Si no se encontró la IPS o ya fue eliminada, retornar un estado 404 (No encontrado)
    if (!deleted) {
      return NextResponse.json(
        { message: "La IPS no fue encontrada o ya ha sido eliminada." },
        { status: 404 }
      );
    }

    // Retornar un mensaje de éxito con estado 200 (OK)
    return NextResponse.json(
      { message: "IPS eliminada con éxito." },
      { status: 200 }
    );
  } catch (error) {
    // Registrar el error en la consola con un mensaje más descriptivo
    console.error("Error al eliminar la IPS:", error);
    // Retornar un mensaje de error con estado 500 (Error del servidor)
    return NextResponse.json(
      { message: "No se pudo eliminar la IPS debido a un error en el servidor." },
      { status: 500 }
    );
  }
}

// Endpoint PUT para actualizar una IPS existente
export async function PUT(request: NextRequest) {


  // Obtener el cuerpo de la solicitud en formato JSON
  const body = await request.json();
  // Extraer el ID y los datos a actualizar del cuerpo de la solicitud
  const { id, ...updateData } = body.ips;

  // Validar que el ID esté presente en la solicitud
  if (!id) {
    return NextResponse.json(
      { message: "Se requiere el ID para actualizar la IPS." },
      { status: 400 }
    );
  }

  // Obtener el servicio de IPS desde el contenedor de inyección de dependencias
  const service = CONTAINER.get<IpsServiceAdapter>(TYPES.IpsServiceAdapter);

  try {
    // Intentar actualizar la IPS usando el servicio
    const updated = await service.update(id, updateData);

    // Si no se encontró la IPS o no se actualizó, retornar un estado 404 (No encontrado)
    if (!updated) {
      return NextResponse.json(
        { message: "La IPS no fue encontrada o no se pudo actualizar." },
        { status: 404 }
      );
    }

    // Retornar la IPS actualizada con estado 200 (OK)
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    // Registrar el error en la consola con un mensaje más descriptivo
    console.error("Error al actualizar la IPS:", error);
    // Retornar un mensaje de error con estado 500 (Error del servidor)
    return NextResponse.json(
      { message: "No se pudo actualizar la IPS debido a un error en el servidor." },
      { status: 500 }
    );
  }
}