#include <Arduino.h>

static int mtr_pins[] = {
    4, // (and 5) = Motor 1
    6, // (and 7) = Motor 2
    8, // (and 9) = Motor 3
};

struct state_t {
    int motors[3];
    int direction;
    int engaged;
} state;

void setup() {
    Serial.begin(9600);

    // set motors pins as OUTPUTS
    for (int i = 0; i < 3; i++) {
        int pin = mtr_pins[i];
        pinMode(pin,   OUTPUT);
        pinMode(pin+1, OUTPUT);
    }

    // init state
    state.motors[0] = 0;
    state.motors[1] = 0;
    state.motors[2] = 0;
    state.direction = 0;
    state.engaged   = 0;
}

int motor_sel = 1;
void loop() {
    if (Serial.available()) {
        byte rx = Serial.read();
    }

    if (1) {
        if (motor_sel == 4) {
            for (int i = 1; i <= 3; i++) {
                engage_motor(i, dir);
                delay(10);
                engage_motor(i, 2);
            }
        } else {
            engage_motor(motor_sel, dir);
            delay(10);
            engage_motor(motor_sel, 2);
        }
    }
}

// engage motor N for a given duration
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
