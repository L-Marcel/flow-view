package flow.app.backend.models;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@IdClass(DataId.class)
public class Data {
    @Id
    @Column(nullable = false)
    private String media;

    @Id
    @Column(nullable = false)
    private LocalDate day = LocalDate.now();

    @Column(nullable = false)
    private Long sent = 0l;

    @Column(nullable = false)
    private Long received = 0l;
};
