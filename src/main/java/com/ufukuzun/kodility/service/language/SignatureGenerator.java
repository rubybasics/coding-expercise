package com.ufukuzun.kodility.service.language;

import com.ufukuzun.kodility.domain.challenge.Challenge;
import com.ufukuzun.kodility.enums.ProgrammingLanguage;

public interface SignatureGenerator {

    boolean canGenerateFor(ProgrammingLanguage language);

    String generate(Challenge challenge);

}
