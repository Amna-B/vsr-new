const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

// Run every 24 hours to clean up inactive rooms
exports.deleteInactiveRooms = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const now = new Date();
  const cutoff = new Date(now.getTime() - THIRTY_DAYS_MS);

  try {
    const snapshot = await db.collection('rooms').get();
    let deletedCount = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const lastActive = data.lastActive?.toDate?.(); // Safely get date

      if (lastActive && lastActive < cutoff) {
        console.log(`Deleting room ${doc.id} last active at ${lastActive}`);
        await doc.ref.delete();
        deletedCount++;
      }
    }

    console.log(`✅ Deleted ${deletedCount} inactive rooms`);
    return null;
  } catch (err) {
    console.error('❌ Error cleaning up rooms:', err);
  }
});
