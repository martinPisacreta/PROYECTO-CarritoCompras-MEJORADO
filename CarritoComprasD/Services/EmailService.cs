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
        private readonly _Email _appSettings_email;

        public EmailService(IOptions<_Email> _appSettings_email)
        {
            this._appSettings_email = _appSettings_email.Value;
        }

        public void Send(string to, string subject, string html, string from = null)
        {


           


            // create message
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(from ?? _appSettings_email.Cuenta));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;
            email.Body = new TextPart(TextFormat.Html) { Text = html };

            // send email
            using var smtp = new SmtpClient();
            smtp.Connect(_appSettings_email.Host, _appSettings_email.Port, MailKit.Security.SecureSocketOptions.None);
            smtp.Authenticate(_appSettings_email.Cuenta, _appSettings_email.Contrasena);
            smtp.Send(email);
            smtp.Disconnect(true);
        }
    }
}