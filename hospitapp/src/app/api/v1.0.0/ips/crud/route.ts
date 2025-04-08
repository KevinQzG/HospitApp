/* eslint-disable no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import CONTAINER from "@/adapters/container";
import IpsServiceAdapter from "@/adapters/services/ips.service.adapter";
import { TYPES } from "@/adapters/types";


export interface Ips { 
    _id?: string;
    department: string;
    town: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    eps?: string;
    specialties?: string[];
    location: {
      type: "Point";
      coordinates: [number, number]; // [lng, lat]
    };
  }


  export async function POST(request: NextRequest) {
    const body = await request.json();
  
    const {
      department,
      town,
      address,
      name,
      phone,
      eps,
      email,
      specialties
    } = body.ips;
  
    if (!name || !address || !phone || !department || !town || !email || !eps) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }
  
    const service = CONTAINER.get<IpsServiceAdapter>(TYPES.IpsServiceAdapter);
  
    try {
      const newIps = await service.create(body.ips);
        
      return NextResponse.json(newIps, { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: "Failed to create IPS." }, { status: 500 });
    }
  }

  export async function DELETE(request: NextRequest) {
    const id = request.nextUrl.searchParams.get("id");
  
    if (!id) {
      return NextResponse.json({ message: "ID is required to delete IPS." }, { status: 400 });
    }
  
    const service = CONTAINER.get<IpsServiceAdapter>(TYPES.IpsServiceAdapter);
  
    try {
      const deleted = await service.delete(id);
  
      if (!deleted) {
        return NextResponse.json({ message: "IPS not found or already deleted." }, { status: 404 });
      }
  
      return NextResponse.json({ message: "IPS deleted successfully." }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: "Failed to delete IPS." }, { status: 500 });
    }
  }

  export async function PUT(request: NextRequest) {
    const body = await request.json();
    const { id, ...updateData } = body.ips;
  
    if (!id) {
      return NextResponse.json({ message: "ID is required to update IPS." }, { status: 400 });
    }
  
    const service = CONTAINER.get<IpsServiceAdapter>(TYPES.IpsServiceAdapter);
  
    try {
      const updated = await service.update(id, updateData);
  
      if (!updated) {
        return NextResponse.json({ message: "IPS not found or not updated." }, { status: 404 });
      }
  
      return NextResponse.json(updated, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: "Failed to update IPS." }, { status: 500 });
    }
  }
  