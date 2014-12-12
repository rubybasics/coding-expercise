package com.kodility.service.email;

import com.kodility.service.email.model.Email;
import com.sendgrid.SendGrid;
import com.sendgrid.SendGridException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
public class SendGridEmailSenderService implements EmailSenderService {

    private Logger LOGGER = LoggerFactory.getLogger(SendGridEmailSenderService.class);

    private SendGrid sendGridClient;

    @PostConstruct
    public void init() {
        // TODO batu: username and pass must be taken from configurationService
        sendGridClient = new SendGrid("SENDGRIDUSER", "SENDGRIDPASS");
    }

    @Override
    public void send(Email email) {
        SendGrid.Email sendGridEmail = prepareSendGridEmailFrom(email);
        sendEmail(sendGridEmail);
    }

    private SendGrid.Email prepareSendGridEmailFrom(Email email) {
        return new SendGrid.Email()
                .addTo(email.getTo())
                .setFrom(email.getFrom())
                .setSubject(email.getSubject())
                .setHtml(email.getContent());
    }

    private void sendEmail(SendGrid.Email sendGridEmail) {
        try {
            SendGrid.Response response = sendGridClient.send(sendGridEmail);
            LOGGER.info(response.getMessage());
        } catch (SendGridException e) {
            LOGGER.error("Exception while sending email via SendGrid.", e);
        }
    }

}