package com.vlf.wma.api.features.feature_ref;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * For Project Structure Reference!
 *
 * Controller Classes handle the main entry points of API endpoint calls.
 */
@Controller
public class FeatureController {

    @Autowired
    private FeatureService featureService;

    @GetMapping("some/mapping/super/cool/yay")
    private FeatureEntity GetEndpoint() {
        return featureService.getEntityById(88);
    }
}
