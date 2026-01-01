-- AddForeignKey
ALTER TABLE "ContactSubmission" ADD CONSTRAINT "ContactSubmission_repliedById_fkey" FOREIGN KEY ("repliedById") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
