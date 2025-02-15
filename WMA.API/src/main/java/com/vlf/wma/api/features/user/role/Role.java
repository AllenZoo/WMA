package com.vlf.wma.api.features.user.role;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EqualsAndHashCode
@Table(name = "roles")
public class Role {
    @Id
    private Long id;

    @Column(name = "name", unique = true)
    private String name;
}
