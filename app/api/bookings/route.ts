import { db } from "@/lib/db";

interface BookingRow {
  id: number;
  booking_ref: string;
  hall_id: string;
  hall_name: string;
  date: string;
  time_slots: string;
  total_paid: number;
  payment_status: string;
  name: string;
  email: string;
  created_at: string;
}

function toBooking(row: BookingRow) {
  return {
    id: row.booking_ref,
    hallId: row.hall_id,
    hallName: row.hall_name,
    date: row.date,
    timeSlots: JSON.parse(row.time_slots) as string[],
    totalPaid: row.total_paid,
    paymentStatus: row.payment_status,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
  };
}

export async function GET() {
  try {
    const rows = db.prepare("SELECT * FROM bookings ORDER BY created_at DESC, id DESC").all() as unknown as BookingRow[];
    return Response.json({ success: true, data: rows.map(toBooking) });
  } catch (error) {
    console.error("Database query failed:", error);
    return Response.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      hallId,
      hallName,
      date,
      timeSlots,
      totalPaid,
      paymentStatus = "success",
      name,
      email,
    } = body;

    if (!hallId || !hallName || !date || !Array.isArray(timeSlots) || !name || !email) {
      return Response.json(
        { success: false, error: "Missing required booking fields" },
        { status: 400 }
      );
    }

    const bookingRef = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
    const createdAt = new Date().toISOString();

    db.prepare(
      `INSERT INTO bookings (booking_ref, hall_id, hall_name, date, time_slots, total_paid, payment_status, name, email, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      bookingRef,
      hallId,
      hallName,
      date,
      JSON.stringify(timeSlots),
      Number(totalPaid),
      paymentStatus,
      name,
      email,
      createdAt
    );

    return Response.json(
      {
        success: true,
        data: {
          id: bookingRef,
          hallId,
          hallName,
          date,
          timeSlots,
          totalPaid: Number(totalPaid),
          paymentStatus,
          name,
          email,
          createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database insert failed:", error);
    return Response.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { success: false, error: "Missing booking id" },
        { status: 400 }
      );
    }

    const result = db.prepare("DELETE FROM bookings WHERE booking_ref = ?").run(id);

    if (result.changes === 0) {
      return Response.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Database delete failed:", error);
    return Response.json(
      { success: false, error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
