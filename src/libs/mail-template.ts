import { formatDate, formatTime } from "./date-time";


export function mailTemplate(
    name: string,
    eventInfo: Record<string, string>
) {
    return `Hi <strong>${name}</strong>,<br/><br/>
Your registration for <strong>${eventInfo.name}</strong> has been successfully completed.<br/>
<b>Date:</b> ${formatDate(eventInfo.date)} <br/>
<b>Time:</b> ${formatTime(eventInfo.time)} (IST)<br/><br/>
Thank you for choosing VEM (Virtual Event Management). We look forward to your participation.<br/><br/>
<em>Best regards,</em><br/>
<strong>The VEM Team</strong>`;
}
