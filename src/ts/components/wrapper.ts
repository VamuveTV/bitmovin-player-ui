import {ContainerConfig, Container} from "./container";
import {NoArgs, EventDispatcher, Event} from "../eventdispatcher";

export interface WrapperConfig extends ContainerConfig {
    // nothing to add
}

export class Wrapper extends Container<WrapperConfig> {

    protected wrapperEvents = {
        onMouseEnter: new EventDispatcher<Wrapper, NoArgs>(),
        onMouseMove: new EventDispatcher<Wrapper, NoArgs>(),
        onMouseLeave: new EventDispatcher<Wrapper, NoArgs>()
    };

    constructor(config: WrapperConfig) {
        super(config);

        this.config = this.mergeConfig(config, {
            tag: 'div',
            cssClass: 'ui-wrapper'
        });
    }


    protected toDomElement(): JQuery {
        let self = this;
        let container = super.toDomElement();

        container.on('mouseenter', function () {
            self.onMouseEnterEvent();
        });
        container.on('mousemove', function () {
            self.onMouseMoveEvent();
        });
        container.on('mouseleave', function () {
            self.onMouseLeaveEvent();
        });

        return container;
    }

    protected onMouseEnterEvent() {
        this.wrapperEvents.onMouseEnter.dispatch(this);
    }

    protected onMouseMoveEvent() {
        this.wrapperEvents.onMouseMove.dispatch(this);
    }

    protected onMouseLeaveEvent() {
        this.wrapperEvents.onMouseLeave.dispatch(this);
    }

    get onMouseEnter(): Event<Wrapper, NoArgs> {
        return this.wrapperEvents.onMouseEnter;
    }

    get onMouseMove(): Event<Wrapper, NoArgs> {
        return this.wrapperEvents.onMouseMove;
    }

    get onMouseLeave(): Event<Wrapper, NoArgs> {
        return this.wrapperEvents.onMouseLeave;
    }
}