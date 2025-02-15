package com.vlf.wma.api.features.user.role;

import org.springframework.stereotype.Service;

@Service
public interface IRoleService {
    /**
     * Returns the associated Role object from DB that has the same name.
     * @param name
     * @return
     */
    Role getRoleByName(String name);
}
