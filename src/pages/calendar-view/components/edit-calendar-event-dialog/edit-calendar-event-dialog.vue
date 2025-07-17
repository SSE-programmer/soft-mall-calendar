<script
    setup
    lang="ts"
>
import { reactive, ref } from 'vue';
import { type ICalendarEvent, isCalendarEvent } from '@/pages/calendar-view/models/ICalendarEvent.ts';
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
import { downloadJSON, reviver, useFormValidation } from '@/shared/utils';
import { useToast } from 'vue-toastification';
import IconUpload from '@/shared/components/icons/icon-upload.vue';
import IconDownload from '@/shared/components/icons/icon-download.vue';

const JSON_FILE_PREFIX = 'calendar-event_';

const toast = useToast();
const calendarEventsStore = useCalendarEventsStore();
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
        toast.error('Failed to create event - form is not valid');

        return;
    }

    calendarEventsStore.save({ ...formData });
    toast.success('Calendar event created');

    closeDialog();
};

const calendarEventDialogStore = useCalendarEventDialogStore();
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

const fileInput = ref<HTMLInputElement>();
const uploadDataFromJSON = () => {
    fileInput.value?.click();
};

const handleFileUpload = async (event: Event) => {
    if (!event.target) {
        return;
    }

    const target = event.target as HTMLInputElement;
    const file = target.files && target.files[0];

    if (!file) return;

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    if (file.size > MAX_SIZE) {
        const message = 'Max file size: 5MB';

        console.error(message);
        toast.error(message);

        return;
    }

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        const message = 'Only json file types are allowed';

        console.error(message);
        toast.error(message);

        return;
    }

    try {
        const content = await readFileAsText(file) as string;
        const result = JSON.parse(content, reviver);

        if (isCalendarEvent(result)) {
            Object.assign(formData, defaultCalendarEvent, result);
        } else {
            const message = 'Data from JSON isn`t Calendar Event';

            console.error(message);
            toast.error(message);
        }
    } catch (err) {
        const message = 'File reading error';

        console.error(message, err);
        toast.error(message);
    }
};

const readFileAsText = (file: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => resolve(event.target?.result);
        reader.onerror = (error) => reject(error);

        reader.readAsText(file);
    });
};
</script>

<template>
    <p-dialog
        v-model:visible="visible"
        modal
        :style="{ width: '500px' }"
        maximizable
    >
        <template #header>
            <input
                style="display: none"
                type="file"
                accept=".json"
                @change="handleFileUpload"
                ref="fileInput"
            >

            <div class="sm-flex sm-gap-8 sm-flex-1 sm-items-center">
                <span class="sm-text-20 sm-font-bold">{{ isEditing ? 'Edit event' : 'New event' }}</span>

                <div class="sm-flex sm-flex-1 sm-items-center">
                    <p-button
                        severity="secondary"
                        text
                        v-tooltip.bottom="'Uploading from JSON'"
                        @click="uploadDataFromJSON"
                    >
                        <icon-upload class="json-load-icon"></icon-upload>
                    </p-button>

                    <p-button
                        severity="secondary"
                        text
                        v-tooltip.bottom="'Download as JSON'"
                        @click="downloadJSON(formData, `${JSON_FILE_PREFIX}${formData.id || new Date().getTime()}`)"
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
