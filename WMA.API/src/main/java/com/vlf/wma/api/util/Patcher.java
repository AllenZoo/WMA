package com.vlf.wma.api.util;

import org.springframework.stereotype.Component;

import java.lang.reflect.Field;
import java.util.Collection;

/**
 * Class used for PATCH requests which require only partial updating of entities and not complete replacements.
 * Utility function checks whether a field is null and whether to update existing entity based on the fact.
 */
@Component
public class Patcher {

    /**
     * Patches an entity. Modifies the existing entity with the patch.
     *
     * @param existing The existing entity to be patched.
     * @param patch The patch entity containing the updated values.
     * @param <T> The type of the entity.
     * @throws IllegalAccessException if the field is not accessible.
     */
    public static <T> void patchEntity(T existing, T patch) throws IllegalAccessException {
        Class<?> entityClass = existing.getClass();
        Field[] entityFields = entityClass.getDeclaredFields();

        for (Field field : entityFields) {
            field.setAccessible(true);
            Object value = field.get(patch);
            // Ignore patching collections (lists) that mess with JPA references
            if (value != null && !Collection.class.isAssignableFrom(field.getType())) {
                field.set(existing, value);
            }
            field.setAccessible(false);
        }
    }
}
