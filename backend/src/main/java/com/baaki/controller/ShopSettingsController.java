package com.baaki.controller;

import com.baaki.model.ShopSettings;
import com.baaki.service.KhataService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class ShopSettingsController {

    private final KhataService khataService;

    public ShopSettingsController(KhataService khataService) {
        this.khataService = khataService;
    }

    @GetMapping
    public ShopSettings get() {
        return khataService.getSettings();
    }

    @PutMapping
    public ShopSettings update(@RequestBody ShopSettings settings) {
        return khataService.updateSettings(settings);
    }

    @PostMapping("/reset")
    public ShopSettings reset() {
        khataService.resetAll();
        return khataService.getSettings();
    }
}
