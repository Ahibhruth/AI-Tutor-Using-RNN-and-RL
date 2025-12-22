# backend/rl_agent.py
import numpy as np

class AdaptiveRLAgent:
    def __init__(self):
        self.q_table = {}
        self.actions = ["easy", "medium", "hard", "revise", "new"]

    def get_state(self, accuracy, difficulty):
        return (round(accuracy, 1), difficulty)

    def choose_action(self, state):
        if state not in self.q_table:
            self.q_table[state] = np.zeros(len(self.actions))
        return int(np.argmax(self.q_table[state]))

    def update(self, state, action, reward, next_state):
        lr = 0.1
        gamma = 0.9
        if next_state not in self.q_table:
            self.q_table[next_state] = np.zeros(len(self.actions))
        self.q_table[state][action] += lr * (
            reward + gamma * max(self.q_table[next_state]) - self.q_table[state][action]
        )
