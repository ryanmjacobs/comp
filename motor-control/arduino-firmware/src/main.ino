#include <Arduino.h>

#define F_SWITCH 2 // fire switch
#define A_SWITCH 3 // arm switch

static int mtr_pins[] = {
    4, // (and 5) = Motor 1
    6, // (and 7) = Motor 2
    8, // (and 9) = Motor 3
};

void setup() {
    Serial.begin(9600);
    Serial.println("Rubber v0.01 -- Ready!");

    // digital switches as inputs w/ pullups
    pinMode(F_SWITCH, INPUT_PULLUP);
    pinMode(A_SWITCH, INPUT_PULLUP);

    // set motors pins as OUTPUTS
    for (int i = 0; i < 3; i++) {
        int pin = mtr_pins[i];
        pinMode(pin,   OUTPUT);
        pinMode(pin+1, OUTPUT);
    }
}

int motor_sel = 1;
void loop() {
    int fire = digitalRead(F_SWITCH);
    int dir  = digitalRead(A_SWITCH);

    if (Serial.available()) {
        byte rx = Serial.read();
        if (rx == '1' || rx == '2' || rx == '3' || rx == '4')
            motor_sel = rx - 48;
    }

    Serial.print("fire = ");
    Serial.print(fire);
    Serial.print(", dir = ");
    Serial.print(dir);
    Serial.print(", motor = ");
    Serial.println(motor_sel);

    if (fire) {
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
