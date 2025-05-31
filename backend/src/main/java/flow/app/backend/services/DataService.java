package flow.app.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import flow.app.backend.models.Data;
import flow.app.backend.repositories.DataRepository;

@Service
public class DataService {
    @Autowired
    private DataRepository repository;

    public List<Data> findAllData() {
        return this.repository.findAll();
    }
}
