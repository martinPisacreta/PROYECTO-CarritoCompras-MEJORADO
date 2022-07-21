using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;
using CarritoComprasD.Helpers;
using CarritoComprasD.Helpers.AppSettings;

namespace CarritoComprasD.Services
{
    public interface IEmailService
    {
        void Send(string to, string subject, string html, string from = null);
    }

    public class EmailService : IEmailService
    {
        private readonly _AppSettings _appSettings_appSettings;

        public EmailService(IOptions<_AppSettings> _appSettings_email)
        {
            this._appSettings_appSettings = _appSettings_email.Value;
        }

        public void Send(string to, string subject, string html, string from = null)
        {
            // create message
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(from ?? _appSettings_appSettings.Email_From));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;
            email.Body = new TextPart(TextFormat.Html) { Text = html };

            // send email
            using var smtp = new SmtpClient();
            smtp.Connect(_appSettings_appSettings.Smtp_Host, _appSettings_appSettings.Smtp_Port, MailKit.Security.SecureSocketOptions.None);
            smtp.Authenticate(_appSettings_appSettings.Email_From, _appSettings_appSettings.Smtp_Pass);
            smtp.Send(email);
            smtp.Disconnect(true);
        }
    }
}