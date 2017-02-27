#include <Arduino.h>

static int mtr_pins[] = {
    4, // (and 5) = Motor 1
    6, // (and 7) = Motor 2
    8, // (and 9) = Motor 3
};

struct state_t {
    byte motors[3];
    byte direction;
    byte engaged;
};

void setup() {
    Serial.begin(9600);

    // set motors pins as OUTPUTS
    for (int i = 0; i < 3; i++) {
        int pin = mtr_pins[i];
        pinMode(pin,   OUTPUT);
        pinMode(pin+1, OUTPUT);
    }
}

static int cnt = 0;
static byte buf[5];

void loop() {
    if (Serial.available()) {
        buf[cnt % 5] = Serial.read();

        if ((++cnt) % 5 == 0) {
            struct state_t state;
            memcpy(buf, &state, 5);
            run_state(state);
        }
    }
}

void run_state(struct state_t state) {
    for (int i = 0; i < 3; i++) {
        engage_motor(i, state.motors[i] ? state.direction : 2);
    }
}

// engage motor N for a given duration
// Valid directions:
//   dir=0 -> forward
//   dir=1 -> reverse
//   dir=2 -> disabled
void engage_motor(int motor, int dir) {
    int pin = mtr_pins[motor-1];

    if (dir == 0) {
        digitalWrite(pin,   LOW);
        digitalWrite(pin+1, HIGH);
    } else if (dir == 1) {
        digitalWrite(pin,   HIGH);
        digitalWrite(pin+1, LOW);
    } else {
        digitalWrite(pin,   LOW);
        digitalWrite(pin+1, LOW);
    }
}
