package com.kodility.controller.user.model;

import com.kodility.utils.validation.PasswordMatch;

import javax.validation.constraints.Size;

@PasswordMatch
public class PasswordModel {

    @Size(min = 6, max = 16)
    private String password;

    @Size(min = 6, max = 16)
    private String passwordRetype;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPasswordRetype() {
        return passwordRetype;
    }

    public void setPasswordRetype(String passwordRetype) {
        this.passwordRetype = passwordRetype;
    }

}
