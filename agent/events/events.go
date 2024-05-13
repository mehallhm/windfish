package events

type Event struct {
	Type      string
	Stack     string
	Timestamp string
	Data      interface{}
}

type EventBus struct {
	subscribers map[string][]chan<- Event
}

func NewEventBus() *EventBus {
	return &EventBus{make(map[string][]chan<- Event)}
}

func (eb *EventBus) Subscribe(eventType string, subscriber chan<- Event) {
	eb.subscribers[eventType] = append(eb.subscribers[eventType], subscriber)
}

func (eb *EventBus) Publish(event Event) {
	subscribers := eb.subscribers[event.Type]
	for _, subscriber := range subscribers {
		subscriber <- event
	}
}
