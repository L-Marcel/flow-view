package flow.app.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import flow.app.backend.models.Data;
import flow.app.backend.models.DataId;

@Repository
public interface DataRepository extends JpaRepository<Data, DataId>{};
