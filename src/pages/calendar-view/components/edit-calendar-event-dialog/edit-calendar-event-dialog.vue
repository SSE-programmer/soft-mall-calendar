<script
    setup
    lang="ts"
>
import { reactive, ref } from 'vue';
import type { ICalendarEvent } from '@/pages/calendar-view/models/ICalendarEvent.ts';
import { useCalendarEventsStore } from '@/stores/calendar/calendar-events.ts';
import { useCalendarEventDialogStore } from '@/stores/calendar/calendar-event-dialog.ts';
import pDialog from 'primevue/dialog';
import pInputText from 'primevue/inputtext';
import pTextarea from 'primevue/textarea';
import pButton from 'primevue/button';
import pToggleSwitch from 'primevue/toggleswitch';
import pDatePicker from 'primevue/datepicker';

const calendarEventsStore = useCalendarEventsStore();
const calendarEventDialogStore = useCalendarEventDialogStore();

const { getDefaultCalendarEvent } = calendarEventsStore;
const visible = ref(false);
const isEditing = ref(false);
const defaultCalendarEvent = getDefaultCalendarEvent();
const formData = reactive<ICalendarEvent>(defaultCalendarEvent);

const openDialog = (item?: ICalendarEvent) => {
    if (item) {
        isEditing.value = true;
        Object.assign(formData, item);
    } else {
        isEditing.value = false;
        resetForm();
    }
    visible.value = true;
};

const closeDialog = () => {
    visible.value = false;
};

const resetForm = () => {
    Object.assign(formData, defaultCalendarEvent);
};

const submitForm = () => {
    if (isEditing.value) {
    } else {
    }

    closeDialog();
    resetForm();
};

calendarEventDialogStore.$onAction(({ name, args }) => {
    switch (name) {
        case 'openDialog':
            openDialog(...args);
            break;
        case 'closeDialog':
            closeDialog(...args);
            break;
    }
});
</script>

<template>
    <p-dialog
        v-model:visible="visible"
        modal
        :header="isEditing ? 'Edit event' : 'New event'"
        :style="{ width: '500px' }"
        maximizable
    >
        <form
            class="sm-flex sm-flex-col sm-gap-24"
            name="calendar-event-form"
        >
            <div class="sm-flex sm-flex-col sm-gap-4">
                <label for="name">Name</label>
                <p-input-text
                    id="name"
                    v-model="formData.name"
                    :required="true"
                    :minlength="1"
                />
            </div>

            <div class="sm-flex sm-flex-col sm-gap-4">
                <label for="description">Description</label>
                <p-textarea
                    id="description"
                    v-model="formData.description"
                    rows="5"
                />
            </div>

            <div class="sm-flex sm-gap-8 sm-items-center">
                <p-toggle-switch
                    id="full-day"
                    v-model="formData.fullDay"
                />
                <label for="full-day">Full day</label>
            </div>

            <div class="sm-flex sm-flex-col sm-gap-4">
                <label for="date-and-time">Date and time</label>

                <div class="sm-flex sm-gap-12 sm-items-center">
                    <div class="sm-flex sm-items-center">
                        <p-date-picker
                            class="sm-flex-1"
                            input-id="date-and-time"
                            v-model="formData.dateStart"
                        />
                        <p-date-picker
                            class="time-picker"
                            input-id="date-and-time"
                            v-model="formData.timeStart"
                            time-only
                            :disabled="formData.fullDay"
                        />
                    </div>

                    一

                    <div class="sm-flex sm-items-center">
                        <p-date-picker
                            class="sm-flex-1"
                            input-id="date-and-time"
                            v-model="formData.dateEnd"
                        />
                        <p-date-picker
                            class="time-picker"
                            input-id="date-and-time"
                            v-model="formData.timeEnd"
                            time-only
                            :disabled="formData.fullDay"
                        />
                    </div>
                </div>
            </div>
        </form>

        <template #footer>
            <div class="sm-flex sm-gap-8 sm-justify-between sm-flex-1">
                <p-button
                    class="sm-w-full"
                    :label="isEditing ? 'Update' : 'Create'"
                    @click="submitForm"
                />

                <p-button
                    class="sm-w-full"
                    label="Cancel"
                    severity="secondary"
                    @click="closeDialog"
                />
            </div>
        </template>
    </p-dialog>
</template>

<style scoped>
.time-picker {
    width: 5em;
}
</style>
