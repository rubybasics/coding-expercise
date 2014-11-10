package com.ufukuzun.kodility.enums;

import java.util.Arrays;
import java.util.Optional;

public enum ProgrammingLanguage {

    JavaScript("js"),
    Python("py"),
    Java("java");

    private String shortName;

    private ProgrammingLanguage(String shortName) {
        this.shortName = shortName;
    }

    public static Optional<ProgrammingLanguage> getLanguage(String shortName) {
        return Arrays.asList(values()).stream()
                .filter(p -> p.getShortName().equals(shortName))
                .findFirst();
    }

    public String getShortName() {
        return shortName;
    }

}
