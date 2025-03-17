package com.demo.rbac.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.demo.rbac.repository.GuideRepository;

@Service
public class GuideService {

    @Autowired
    private GuideRepository guideRepository;

    public Long getGuideIdByEmail(String email) {
        return guideRepository.findGuideIdByEmail(email).orElse(null);
    }
}
