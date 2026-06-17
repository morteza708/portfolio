import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

type RevalidateBody = {
  secret?: string;
  tags?: string[];
};

export async function POST(request: NextRequest) {
  let body: RevalidateBody;

  try {
    body = (await request.json()) as RevalidateBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const providedSecret =
    body.secret ?? request.headers.get("x-revalidation-secret") ?? "";

  if (
    !process.env.REVALIDATION_SECRET ||
    providedSecret !== process.env.REVALIDATION_SECRET
  ) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const tags = body.tags ?? [];

  if (tags.length === 0) {
    return NextResponse.json({ message: "No tags provided" }, { status: 400 });
  }

  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }

  return NextResponse.json({ revalidated: true, tags });
}
