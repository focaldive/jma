import prisma from "../lib/prisma";

async function testCreateEvent() {
  console.log("Starting Event API Test...");

  const testData = {
    title: "Annual Charity Gala " + Date.now(),
    slug: "annual-charity-gala-" + Date.now(),
    description: "A wonderful evening for a great cause.",
    date: new Date(),
    location: "Grand Ballroom",
    isPublished: true,
  };

  try {
    const event = await prisma.event.create({
      data: testData,
    });
    console.log("Successfully created event:", event.id);

    // Clean up
    await prisma.event.delete({
      where: { id: event.id },
    });
    console.log("Cleaned up test event.");

    process.exit(0);
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
}

testCreateEvent();
