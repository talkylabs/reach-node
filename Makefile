.PHONY: test-install install test test-docker docs clean prettier

test-install:
	npm install --only=dev

install:
	@node --version || (echo "Node is not installed, please install Node >= 14"; exit 1);
	rm -f package-lock.json
	npm install

test:
	npm test

test-docker:
	docker build -t talkylabs/reach-node .
	docker run talkylabs/reach-node npm run ci

docs:
	npm run typedoc

clean:
	rm -rf node_modules lib

prettier:
	npm run prettier

API_DEFINITIONS_SHA=$(shell git log --oneline | grep Regenerated | head -n1 | cut -d ' ' -f 5)
CURRENT_TAG=$(shell expr "${GITHUB_TAG}" : ".*-rc.*" >/dev/null && echo "rc" || echo "latest")
docker-build:
	docker build -t talkylabs/reach-node .
	docker tag talkylabs/reach-node talkylabs/reach-node:${GITHUB_TAG}
	docker tag talkylabs/reach-node talkylabs/reach-node:apidefs-${API_DEFINITIONS_SHA}
	docker tag talkylabs/reach-node talkylabs/reach-node:${CURRENT_TAG}

docker-push:
	docker push talkylabs/reach-node:${GITHUB_TAG}
	docker push talkylabs/reach-node:apidefs-${API_DEFINITIONS_SHA}
	docker push talkylabs/reach-node:${CURRENT_TAG}
