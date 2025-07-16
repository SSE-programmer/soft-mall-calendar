<script
    setup
    lang="ts"
>
import { reactive, ref } from 'vue';
import type { ICalendarEvent } from '@/pages/calendar-view/models/ICalendarEvent.ts';
import { useCalendarEventsStore } from '@/stores/calendar/calendar-events.ts';
import { useCalendarEventDialogStore } from '@/stores/calendar/calendar-event-dialog.ts';
import { z } from 'zod';
import pDialog from 'primevue/dialog';
import pInputText from 'primevue/inputtext';
import pTextarea from 'primevue/textarea';
import pButton from 'primevue/button';
import pToggleSwitch from 'primevue/toggleswitch';
import pDatePicker from 'primevue/datepicker';
import pMessage from 'primevue/message';
import { useFormValidation } from '@/shared/utils/form-validation.ts';
import IconUpload from '@/shared/components/icons/icon-upload.vue';
import IconDownload from '@/shared/components/icons/icon-download.vue';

const calendarEventsStore = useCalendarEventsStore();
const calendarEventDialogStore = useCalendarEventDialogStore();

const { getDefaultCalendarEvent } = calendarEventsStore;
const visible = ref(false);
const isEditing = ref(false);
const defaultCalendarEvent = getDefaultCalendarEvent();
const formSchema = z.object({
    name: z.string().nonempty('Name required'),
    description: z.string(),
    dateStart: z.date(),
    dateEnd: z.date(),
    timeStart: z.date().optional(),
    timeEnd: z.date().optional()
});
const formData = reactive<ICalendarEvent>({ ...defaultCalendarEvent });
const { errors, validate, reset } = useFormValidation(formSchema, formData);

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
    resetForm();
};

const resetForm = () => {
    Object.assign(formData, defaultCalendarEvent);
    reset();
};

const submitForm = async () => {
    const isValid = await validate();

    if (!isValid) {
        return;
    }

    calendarEventsStore.save({ ...formData });

    closeDialog();
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
        :style="{ width: '500px' }"
        maximizable
    >
        <template #header>
            <div class="sm-flex sm-gap-8 sm-flex-1 sm-items-center">
                <span class="sm-text-20 sm-font-bold">{{ isEditing ? 'Edit event' : 'New event' }}</span>

                <div class="sm-flex sm-flex-1 sm-items-center">
                    <p-button
                        severity="secondary"
                        text
                        v-tooltip.bottom="'Uploading from JSON'"
                    >
                        <icon-upload class="json-load-icon"></icon-upload>
                    </p-button>

                    <p-button
                        severity="secondary"
                        text
                        v-tooltip.bottom="'Download as JSON'"
                    >
                        <icon-download class="json-load-icon"></icon-download>
                    </p-button>
                </div>
            </div>
        </template>

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
                    :invalid="!!errors['name']"
                />
                <p-message
                    v-if="errors['name']"
                    severity="error"
                >
                    {{ errors['name'] }}
                </p-message>
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

.json-load-icon {
    width: 20px;
}
</style>
