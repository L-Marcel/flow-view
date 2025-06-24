package flow.app.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import flow.app.backend.models.Data;
import flow.app.backend.services.DataService;

@RestController
@RequestMapping("/")
public class DataController {
    @Autowired
    private DataService service;

    @GetMapping
    private ResponseEntity<List<Data>> findAll() {
        List<Data> data = service.findAllData();
        return ResponseEntity.ok().body(data);
    };
};
