import { db } from "@/configs/db";
import { usersTable, wireframeToCodeTable } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { description, imageUrl, model, uid, email } = await req.json();

  const creditsResult = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (creditsResult[0]?.credits && creditsResult[0]?.credits > 0) {
    const result = await db
      .insert(wireframeToCodeTable)
      .values({
        uid: uid,
        description: description,
        imageUrl: imageUrl,
        model: model,
        createdBy: email,
      })
      .returning({ id: wireframeToCodeTable.id });

      //Updating user Credits
      const data = await db.update(usersTable).set({
        credits: creditsResult[0]?.credits - 1,
      }).where(eq(usersTable.email, email))

    return NextResponse.json(result);
  } else {
    return NextResponse.json({ error: "Insufficient credits" });
  }
}

export async function GET(req: NextResponse) {
  const reqUrl = req.url;
  const { searchParams } = new URL(reqUrl);
  const uid = searchParams?.get("uid");
  const email = searchParams?.get("email");
  if (uid) {
    const result = await db
      .select()
      .from(wireframeToCodeTable)
      .where(eq(wireframeToCodeTable.uid, uid));
    return NextResponse.json(result[0]);
  } else if (email) {
    const result = await db
      .select()
      .from(wireframeToCodeTable)
      .where(eq(wireframeToCodeTable.createdBy, email));
    return NextResponse.json(result);
  } else {
    return NextResponse.json({ error: "No record found" });
  }
}

export async function PUT(req: NextRequest) {
  const { uid, codeResp } = await req.json();
  const result = await db
    .update(wireframeToCodeTable)
    .set({
      code: codeResp,
    })
    .where(eq(wireframeToCodeTable.uid, uid))
    .returning({ uid: wireframeToCodeTable.uid });

  return NextResponse.json(result);
}
