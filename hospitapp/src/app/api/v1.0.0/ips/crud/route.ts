/* eslint-disable no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import CONTAINER from "@/adapters/container";
import IpsServiceAdapter from "@/adapters/services/ips.service.adapter";
import { TYPES } from "@/adapters/types";

// Definición de la interfaz Ips para tipar los datos de una IPS
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

// Endpoint POST para crear una nueva IPS
export async function POST(request: NextRequest) {
  // Obtener el cuerpo de la solicitud en formato JSON
  const body = await request.json();

  // Extraer los datos necesarios del cuerpo de la solicitud
  const { department, town, address, name, phone, email } = body.ips;

  // Validar que todos los campos requeridos estén presentes
  if (!name || !address || !phone || !department || !town || !email) {
    return NextResponse.json(
      { message: "Faltan campos obligatorios para crear la IPS." },
      { status: 400 }
    );
  }

  // Obtener el servicio de IPS desde el contenedor de inyección de dependencias
  const service = CONTAINER.get<IpsServiceAdapter>(TYPES.IpsServiceAdapter);

  try {
    // Intentar crear una nueva IPS usando el servicio
    const newIps = await service.create(body.ips);

    // Retornar la IPS creada con un estado 201 (Creado)
    return NextResponse.json(newIps, { status: 201 });
  } catch (error) {
    // Registrar el error en la consola con un mensaje más descriptivo
    console.error("Error al crear la IPS:", error);
    // Retornar un mensaje de error con estado 500 (Error del servidor)
    return NextResponse.json(
      { message: "No se pudo crear la IPS debido a un error en el servidor." },
      { status: 500 }
    );
  }
}

// Endpoint DELETE para eliminar una IPS existente
export async function DELETE(request: NextRequest) {
  // Obtener el ID de la IPS desde los parámetros de la URL
  const id = request.nextUrl.searchParams.get("id");

  // Validar que el ID esté presente en la solicitud
  if (!id) {
    return NextResponse.json(
      { message: "Se requiere el ID para eliminar la IPS." },
      { status: 400 }
    );
  }

  // Obtener el servicio de IPS desde el contenedor de inyección de dependencias
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