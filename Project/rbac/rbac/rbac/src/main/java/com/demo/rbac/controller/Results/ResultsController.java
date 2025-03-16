package com.demo.rbac.controller.Results;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.demo.rbac.model.Results;
import com.demo.rbac.service.Results.ResultsService;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "http://localhost:5173")
public class ResultsController {

    private static final Logger logger = LoggerFactory.getLogger(ResultsController.class);

    @Autowired
    private ResultsService ResultsService;  // ✅ Fixed naming convention

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty. Please upload a valid Excel file.");
            }

            List<Results> savedResultss = ResultsService.saveResultssFromExcel(file);  // ✅ Process file
            return ResponseEntity.ok(savedResultss);  // ✅ Return the saved Resultss
        } catch (Exception e) {
            logger.error("Error processing Excel file: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error processing file: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllResultss() {
        try {
            List<Results> Resultss = ResultsService.getAllResultss();  // ✅ Fetch Resultss
            if (Resultss.isEmpty()) {
                return ResponseEntity.ok("No Resultss available.");
            }
            return ResponseEntity.ok(Resultss);
        } catch (Exception e) {
            logger.error("Error retrieving Resultss: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error retrieving Resultss: " + e.getMessage());
        }
    }
}
