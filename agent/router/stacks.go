package router

func (r *RouterInitializer) RegisterStackEndpoints() {
	stackGroup := r.api.Group("/stacks")
	_ = stackGroup
}
