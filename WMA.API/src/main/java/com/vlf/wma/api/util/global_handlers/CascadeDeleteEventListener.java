package com.vlf.wma.api.util.global_handlers;

import com.vlf.wma.api.features.exercise.entity.IExerciseService;
import com.vlf.wma.api.features.user.UserEntity;
import org.hibernate.HibernateException;
import org.hibernate.event.spi.DeleteContext;
import org.hibernate.event.spi.DeleteEvent;
import org.hibernate.event.spi.DeleteEventListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component
public class CascadeDeleteEventListener implements DeleteEventListener {
    //public static final CascadeDeleteEventListener INSTANCE =
       //     new CascadeDeleteEventListener();

    @Autowired
    @Lazy
    private IExerciseService exerciseService;

    @Override
    public void onDelete(DeleteEvent deleteEvent) throws HibernateException {
        if (deleteEvent.getObject().getClass().equals(UserEntity.class)) {
            HandleUserDeleteCascade((UserEntity) deleteEvent.getObject());
        }
    }

    @Override
    public void onDelete(DeleteEvent deleteEvent, DeleteContext deleteContext) throws HibernateException {
        onDelete(deleteEvent);
    }

    /**
     * Handles cascade deletes here for UserEntity.
     * Currently Cascade deletes include:
     *    - exercises
     *
     *  TODO:
     *    - workout_logs
     * @param user
     */
    private void HandleUserDeleteCascade(UserEntity user) {
        exerciseService.deleteExercisesByUser(user);
    }
}
