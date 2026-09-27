# Form Data Collection (Google Sheets)

Every form on the website (Contact, Work With Us, Partner, Collaborate) saves its submissions to one Google Sheet. Each form gets its own tab, so the team can open the sheet in Google Sheets (or download it as Excel) and follow up from there.

| Website page | Tab | Columns |
| --- | --- | --- |
| `/contact` | Contact | Timestamp, Name, Email, Reaching out as, Message, Status, Notes |
| `/careers` | Work With Us | Timestamp, Name, Email, Phone, Domain, Experience, Portfolio / Link, Why Genesis, Status, Notes |
| `/partner` | Partner | Timestamp, Name, Email, Phone, Company / College, Partnership type, Website, Details, Attachment, Status, Notes |
| `/collaborate` | Collaborate | Timestamp, Name, Email, Phone, Organization / Event, Collaboration type, Website, Details, Status, Notes |

On the Partner form, choosing **Event sponsorship** or **Community partnership** shows an optional brochure / pitch deck upload (PDF, PPT or PPTX, up to 3 MB). The file is saved to a Drive folder called `Genesis Form Uploads` in the Google account that owns the script, and its link goes in the **Attachment** column. The files are private: share that folder with teammates who need them.

`Status` is set to `New` on every submission. Change it to whatever you use to track follow-up (`Contacted`, `In talks`, `Closed`) and use `Notes` for anything else. The script never overwrites those two columns.

The script lives in [`docs/google-sheets/Code.gs`](google-sheets/Code.gs).

## One-time setup

1. Create a blank sheet at [sheets.google.com](https://sheets.google.com) and name it `Genesis Website Form Submissions`.
2. Open **Extensions > Apps Script**, delete the default code, and paste in the contents of `docs/google-sheets/Code.gs`.
3. Select the `setup` function in the toolbar and click **Run**. Approve the permissions prompt. This creates the four tabs with headers.
   Google will ask for Drive access as well as Sheets access, because the script saves uploads to Drive.
4. Click **Deploy > New deployment**, choose type **Web app**, then set:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` (required so the website can post without a Google login)
5. Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).
6. Paste the URL into the environment variables, locally in `frontend/.env` and in the Vercel project settings for production:

   ```env
   GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   REACT_APP_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

7. Redeploy the site (Vercel bakes `REACT_APP_*` values in at build time).

## Check that it works

- Open the Web app URL in a browser. You should see `{"result":"ok","forms":[...]}`.
- Submit the Partner form on the site and confirm a new row appears in the **Partner** tab.
- Submit it again with **Event sponsorship** selected and a small PDF attached. The row should have a Drive link in **Attachment**, and the file should be in the `Genesis Form Uploads` folder.

## Getting the data

- **Online**: open the Google Sheet and share it with teammates (**Share** button, Viewer or Editor).
- **Excel**: in the sheet, use **File > Download > Microsoft Excel (.xlsx)**. Each tab becomes a worksheet.
- **Live copy in Excel**: use **Data > From Web** in Excel against a published CSV link (**File > Share > Publish to web**, pick a tab and CSV). Only do this if the sheet contains nothing you would not want a public link to expose.

## Changing the script later

After editing `Code.gs` in Apps Script, use **Deploy > Manage deployments > Edit > New version**. Saving alone does not update the live web app, and creating a new deployment changes the URL.

## Notes

- If you already ran `setup` before uploads were added, the Partner tab has no **Attachment** column and new rows will be misaligned. Delete the Partner tab and run `setup` again, or insert a column named `Attachment` between `Details` and `Status`. Then publish a new version of the deployment.
- Uploads are limited to 3 MB because the site's serverless function accepts requests up to about 4.5 MB and files grow by a third when encoded. Larger decks should be shared as a link in the message.
- Submissions are stored as they arrive. There is no retry queue, so if the webhook URL is missing or wrong, the submission is not saved anywhere. Confirm the check above after every deployment.
- The sheet contains personal data (names, emails, phone numbers). Keep it restricted to the team and mention it in the privacy policy.
