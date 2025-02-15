package com.vlf.wma.api.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class EnumConverterClass {
    public static  <E extends Enum<E>> List<E> convertToEnumList(List<String> values, Class<E> enumClass) throws IllegalArgumentException {
        if (values == null) {
            return new ArrayList<>();
        }
        return values.stream()
                .map(value -> convertToEnum(value, enumClass))
                .collect(Collectors.toList());
    }
    public static  <E extends Enum<E>> E convertToEnum(String value, Class<E> enumClass) throws IllegalArgumentException {
        if (value == null || value.isEmpty()) {
            return null;
        }
        try {
            return Enum.valueOf(enumClass, value.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Create a list of valid enum values
            String validValues = Arrays.stream(enumClass.getEnumConstants())
                    .map(Enum::name)
                    .collect(Collectors.joining(", "));
            throw new IllegalArgumentException(
                    String.format("Invalid value '%s' for enum %s. Valid values are: %s",
                            value, enumClass.getSimpleName(), validValues), e);
        }
    }
}
